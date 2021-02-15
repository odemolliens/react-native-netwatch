package com.imranmentese.reactnativenetwatch.interceptor;

import android.util.Log;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;


/**
 * Created by MENTESE Imran on 09/02/2021.
 */

public class NetworkInterceptor implements Interceptor {
    @Override public Response intercept(Interceptor.Chain chain) throws IOException {
        Request request = chain.request();

        long t1 = System.nanoTime();
        Log.e("<<>> NetworkInterceptor", "<<>> Sending request : " + request.url());

        Response response = chain.proceed(request);

        long t2 = System.nanoTime();
        Log.e("<<>> NetworkInterceptor", "<<>> Duration : " + (t2 - t1));
        Log.e("<<>> NetworkInterceptor", "<<>> Received response header : " + response.headers());
        Log.e("<<>> NetworkInterceptor", "<<>> Received response body : " + response.body().string());

        return response;
    }
}