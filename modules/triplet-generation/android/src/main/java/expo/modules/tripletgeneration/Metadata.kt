package expo.modules.tripletgeneration

import android.content.Context
import android.media.ExifInterface
import android.net.Uri
import android.util.Log
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

fun generateMetadataTriplets(context: Context, imgs: List<Uri>): List<List<Uri>> {
    val imgDates = getImgDates(context, imgs)
    val sortedImgDates = imgDates.toList().sortedBy { (_, value) -> value }.toMap()

    var triplets = mutableListOf<List<Uri>>()

    var subtract = false
    for (i in imgs.indices step 3) {
        Log.d("triplet-gen", "imgs $i to ${i + 2}")

        var index = i
        if (subtract) {
            index -= 1
        }

        val img1 = sortedImgDates.keys.elementAt(index)
        val img2 = sortedImgDates.keys.elementAt(index + 1)

        Log.d("triplet-gen", "pairing the below images")
        Log.d("triplet-gen", sortedImgDates[img1].toString())
        Log.d("triplet-gen", sortedImgDates[img2].toString())

        var newTriplet: List<Uri> = listOf()
        if ((imgs.size - i) == 4 || (imgs.size - i) == 2) {
            newTriplet = listOf(img1, img2)
            subtract = true
        } else {
            val img3 = sortedImgDates.keys.elementAt(index + 2)
            newTriplet = listOf(img1, img2, img3)

            Log.d("triplet-gen", sortedImgDates[img3].toString())
        }

        triplets.add(newTriplet)
    }

    return triplets
}

private fun getImgDates(context: Context, imgs: List<Uri>): MutableMap<Uri, Date> {
    val imgDates: MutableMap<Uri, Date> = mutableMapOf()

    for (img in imgs) {
        var extractedDate: Date? = null

        context.contentResolver.openInputStream(img)?.use { inputStream ->
            val exifInterface = ExifInterface(inputStream)

            val original = exifInterface.getAttribute(ExifInterface.TAG_DATETIME_ORIGINAL)
            extractedDate = original?.let { convertToDate(it) }

            if (extractedDate == null) {
                val digitization = exifInterface.getAttribute(ExifInterface.TAG_DATETIME_DIGITIZED)
                extractedDate = digitization?.let { convertToDate(it) }
            }

            if (extractedDate == null) {
                val date = exifInterface.getAttribute(ExifInterface.TAG_DATETIME)
                extractedDate = date?.let { convertToDate(it) }
            }
        }

        imgDates[img] = extractedDate ?: Date()
    }

    return imgDates
}

private fun convertToDate(dateString: String): Date? {
    val exifFormat = SimpleDateFormat("yyyy:MM:dd HH:mm:ss", Locale.getDefault())
    val date = exifFormat.parse(dateString)
    return date
}
