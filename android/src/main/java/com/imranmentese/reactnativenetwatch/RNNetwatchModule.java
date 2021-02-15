package com.imranmentese.reactnativenetwatch;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.imranmentese.reactnativenetwatch.interceptor.NetworkInterceptor;


import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;

/**
 * Created by MENTESE Imran on 09/02/2021.
 */

public class RNNetwatchModule extends ReactContextBaseJavaModule {
    public static String MODULE_NAME = "RNNetwatch";

    /**
     * OkHttp client to perform HTTP requests
     */
    private OkHttpClient okHttpClient;

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public RNNetwatchModule(ReactApplicationContext context) {
        super(context);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void startNativeInterceptor() {
        if (okHttpClient == null) {
            Log.e("<<>>", "<<>> start");
            okHttpClient = new OkHttpClient().newBuilder().addNetworkInterceptor(new NetworkInterceptor()).build();
        }
    }
}
