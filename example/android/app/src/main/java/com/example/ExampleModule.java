package com.example;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.imranmentese.reactnativenetwatch.interceptor.NetworkInterceptor;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ExampleModule extends ReactContextBaseJavaModule {
    ReactApplicationContext mContext;
    OkHttpClient client;
    ExampleModule(ReactApplicationContext context) {
        super(context);
        mContext = context;
        client = new OkHttpClient.Builder().addInterceptor(new NetworkInterceptor(mContext)).build();
    }

    @Override
    public String getName() {
        return "ExampleModule";
    }

    @ReactMethod
    public void fetchSomething(String url) {
        volleyGet(url);
    }


    public void volleyGet(String url){
        Request request = new Request.Builder()
                .url(url)
                .header("User-Agent", "OkHttp Example")
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code " + response);
                } else {
                    Log.e("<<>>", "<<>> Response : " + response);
                }
            }
        });
    }
}
