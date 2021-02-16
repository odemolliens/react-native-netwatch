package com.imranmentese.reactnativenetwatch;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.imranmentese.reactnativenetwatch.interceptor.NetworkInterceptor;
import com.imranmentese.reactnativenetwatch.model.NativeRequest;

import java.lang.reflect.Type;
import java.util.List;

/**
 * Created by MENTESE Imran on 09/02/2021.
 */

public class RNNetwatchModule extends ReactContextBaseJavaModule {
    public static String MODULE_NAME = "RNNetwatch";
    public static String NATIVE_REQUESTS = "NATIVE_REQUESTS";
    public static int HTTP_COMPLETE_STATUS = 4;

    SharedPreferences sharedPrefs;

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
            result = result.replaceAll("\\\\", "");
            result = result.replaceAll("\\\\\"", "\"");
            result = result.replaceAll("\\\"\\{", "{");
            result = result.replaceAll("\\}\\\"", "}");
            result = result.replaceAll("u003d", "=");
        }
        WritableMap wResultMap = new WritableNativeMap();
        wResultMap.putString("result", result);
        return wResultMap;
    }

    /**
     * Convert a string to a JSON with the said string.
     *
     * @param result The string to convert.
     * @return The JSON form.
     */
    public static WritableMap getResultMap(String result) {
        WritableMap wResultMap = new WritableNativeMap();
        wResultMap.putString("result", result);
        return wResultMap;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public RNNetwatchModule(ReactApplicationContext context) {
        super(context);
        sharedPrefs = context.getSharedPreferences(MODULE_NAME, Context.MODE_PRIVATE);
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
}
