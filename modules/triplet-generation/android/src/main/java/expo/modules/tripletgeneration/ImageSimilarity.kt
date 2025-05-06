package expo.modules.tripletgeneration

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import org.tensorflow.lite.DataType
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.ops.NormalizeOp
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import kotlin.math.sqrt

fun generateSimilarityTriplets(context: Context, imgs: List<Uri>): List<List<Uri>> {
    val model = loadModel(context) ?: throw Exception("Unable to load model")
    val featureVectors = getFeatureVectors(context, model, imgs)
    Log.d("triplet-gen", "Feature vectors generated")

    val remainingImgs = imgs.toMutableList()
    val triplets = mutableListOf<List<Uri>>()

    while (remainingImgs.size > 0) {
        val img1 = remainingImgs.removeAt(0)
        val img1FV = featureVectors[img1]!!

        val similarities = mutableMapOf<Uri, Float>()
        for (img2 in remainingImgs) {
            val img2FV = featureVectors[img2]!!
            val similarity = cosineSimilarity(img1FV, img2FV)
            similarities[img2] = similarity
        }

        val newTriplet: MutableList<Uri> = mutableListOf(img1)

        val sortedSimilarities = similarities.toList().sortedByDescending { (_, value) -> value }.toMap()
        newTriplet += sortedSimilarities.keys.first()
        if (sortedSimilarities.size != 3 && sortedSimilarities.size != 1) {
            newTriplet += sortedSimilarities.keys.elementAt(1)
        }

        triplets.add(newTriplet)
        remainingImgs.removeAll(newTriplet)

        Log.d("triplet-gen", "triplet created")
        Log.d("triplet-gen", triplets.toString())
        Log.d("triplet-gen", similarities.toList().take(2).toString())
    }

    Log.d("triplet-gen", "Triplets generated")
    Log.d("triplet-gen", triplets.toString())

    return triplets.toList()
}

private fun loadModel(context: Context): Interpreter? {
    try {
        val modelFile = "mobilenet_v2.tflite"

        // with 'use' here, the file will be closed automatically
        val modelByteBuffer: MappedByteBuffer = context.assets.openFd(modelFile).use { fileDesc ->
            FileInputStream(fileDesc.fileDescriptor).use { inputStream ->
                val fileChannel = inputStream.channel
                val startOffset = fileDesc.startOffset
                val declaredLength = fileDesc.declaredLength
                fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
            }
        }

        val interpreter = Interpreter(modelByteBuffer)
        return interpreter
    } catch (e: Exception) {
        return null
    }
}

private fun getFeatureVectors(context: Context, model: Interpreter, imgs: List<Uri>): MutableMap<Uri, FloatArray> {
    val imgFeatureVectors: MutableMap<Uri, FloatArray> = mutableMapOf()

    for (img in imgs) {
        // get the image bitmap using uri
        val bitmap: Bitmap
        context.contentResolver.openInputStream(img).use { inputStream ->
            bitmap = BitmapFactory.decodeStream(inputStream)
        }

        // preprocess the image and create output tensor buffer
        val processedImg = preprocess(bitmap)
        val outputBuffer = TensorBuffer.createFixedSize(intArrayOf(1, 224, 224, 3), DataType.FLOAT32)

        // extract feature vectors
        model.run(processedImg.buffer, outputBuffer.buffer.rewind())
        imgFeatureVectors[img] = outputBuffer.floatArray
    }

    return imgFeatureVectors
}

private fun preprocess(bitmap: Bitmap): TensorBuffer {
    // load the bitmap
    val tensorImg = TensorImage(DataType.FLOAT32)
    tensorImg.load(bitmap)

    // resize and normalise the image
    val processor = ImageProcessor.Builder()
        .add(ResizeOp(224, 224, ResizeOp.ResizeMethod.BILINEAR))
        .add(NormalizeOp(127.5f, 127.5f)) // [-1, 1]
        .build()
    val processedImg = processor.process(tensorImg)

    return processedImg.tensorBuffer
}

private fun cosineSimilarity(a: FloatArray, b: FloatArray): Float {
    // calculate dot product
    var dotProduct = 0f
    for (i in a.indices) {
        dotProduct += a[i] * b[i]
    }

    // calculate magnitudes (||a|| and ||b||)
    var aMagnitude = 0f
    var bMagnitude = 0f
    for (i in a.indices) {
        aMagnitude += a[i] * a[i]
        bMagnitude += b[i] * b[i]
    }
    aMagnitude = sqrt(aMagnitude)
    bMagnitude = sqrt(bMagnitude)

    // return cosine similarity
    return dotProduct / (aMagnitude * bMagnitude)
}
