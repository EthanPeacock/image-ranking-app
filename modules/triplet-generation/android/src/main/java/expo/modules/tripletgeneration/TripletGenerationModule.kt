package expo.modules.tripletgeneration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.net.Uri
import androidx.core.net.toUri

class TripletGenerationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("TripletGeneration")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("similarity") { imgPaths: List<String> ->
      // try get the current context. if null, throw an exception
      val currContext = appContext.reactContext ?: throw Exception("No context available")

      // convert the image uri strings to android uris
      val imgs: List<Uri> = imgPaths.map { pathString -> pathString.toUri() }

      val triplets = generateSimilarityTriplets(currContext, imgs)

      return@Function triplets
    }

    Function("metadata") { imgPaths: List<String> ->
      // try get the current context. if null, throw an exception
      val currContext = appContext.reactContext ?: throw Exception("No context available")

      // convert the image uri strings to android uris
      val imgs: List<Uri> = imgPaths.map { pathString -> pathString.toUri() }

      val triplets = generateMetadataTriplets(currContext, imgs)

      return@Function triplets
    }
  }
}
