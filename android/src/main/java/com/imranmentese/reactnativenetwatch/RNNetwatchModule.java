package com.imranmentese.reactnativenetwatch;

import android.content.Context;
import android.content.SharedPreferences;
import android.hardware.SensorManager;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.imranmentese.reactnativenetwatch.model.NativeRequest;
import com.imranmentese.reactnativenetwatch.shake.CustomShakeDetector;

import org.apache.commons.text.StringEscapeUtils;

import java.lang.reflect.Type;
import java.util.List;

/**
 * Created by MENTESE Imran on 09/02/2021.
 */

public class RNNetwatchModule extends ReactContextBaseJavaModule {
    // =============
    // | Constants |
    // =============
    public static String MODULE_NAME = "RNNetwatch";
    public static String NATIVE_REQUESTS = "NATIVE_REQUESTS";
    public static int MAX_SAVED_REQUESTS = 20;
    public static int HTTP_COMPLETED = 4;

    // =============
    // | Variables |
    // =============

    SharedPreferences sharedPrefs;
    ReactApplicationContext mReactContext;
    CustomShakeDetector cShakeDetector;

    // =============
    // | Internals |
    // =============

    /**
     * Convert an object into JSON.
     *
     * @param object an object which will convert to json.
     * @return a WritableMap with the object in it.
     */
    public static WritableMap getResultMap(Object object) {
        Gson gson = new Gson();
        String result = gson.toJson(object);
        if (result != null) {
            result = StringEscapeUtils.unescapeJava(result);
            result = result.replaceAll("\\\"\\{", "{");
            result = result.replaceAll("\\}\\\"", "}");
        }
        WritableMap wResultMap = new WritableNativeMap();
        wResultMap.putString("result", result);
        return wResultMap;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public RNNetwatchModule(final ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        sharedPrefs = reactContext.getSharedPreferences(MODULE_NAME, Context.MODE_PRIVATE);

        cShakeDetector = new CustomShakeDetector(new CustomShakeDetector.ShakeListener() {
            @Override
            public void onShake() {
                sendEvent(reactContext, "NetwatchShakeEvent", null);
            }
        });
        cShakeDetector.start(
                (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE));
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getNativeRequests(final Callback callback) {
        Gson gson = new Gson();
        String result = sharedPrefs.getString(NATIVE_REQUESTS, "");
        Type type = new TypeToken<List<NativeRequest>>() {}.getType();
        List<NativeRequest> requests = gson.fromJson(result, type);

        callback.invoke(getResultMap(requests));

        // clean after each return
        sharedPrefs.edit().clear().apply();
    }

    // Specific to iOS, nothing to do on android side
    @SuppressWarnings("unused")
    @ReactMethod
    public void startNetwatch() { }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        }
    }
}
