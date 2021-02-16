package com.imranmentese.reactnativenetwatch.interceptor;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.imranmentese.reactnativenetwatch.model.NativeRequest;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

import static com.imranmentese.reactnativenetwatch.RNNetwatchModule.MODULE_NAME;
import static com.imranmentese.reactnativenetwatch.RNNetwatchModule.NATIVE_REQUESTS;


/**
 * Created by MENTESE Imran on 09/02/2021.
 */

public class NetworkInterceptor implements Interceptor {
    SharedPreferences sharedPrefs;

    public NetworkInterceptor(Context context) {
        super();
        sharedPrefs = context.getSharedPreferences(MODULE_NAME, Context.MODE_PRIVATE);
        // clean SharedPref before first use
        sharedPrefs.edit().clear().apply();
    }

    @Override public Response intercept(Interceptor.Chain chain) throws IOException {
        Request request = chain.request();
        long startTime = System.currentTimeMillis();

        Response response = chain.proceed(request);
        long endTime = System.currentTimeMillis();

        // Create object from response
        NativeRequest nativeRequest = new NativeRequest(response, startTime, endTime);

        // Retrieve data from cache and add new request
        String resultFromPref = sharedPrefs.getString(NATIVE_REQUESTS, "");

        Gson gson = new Gson();
        Type type = new TypeToken<List<NativeRequest>>() {}.getType();
        List<NativeRequest> requests = new ArrayList<NativeRequest>();
        List<NativeRequest> requestsFromPref = gson.fromJson(resultFromPref, type);
        if (requestsFromPref != null) {
            requests = requestsFromPref;
        }
        requests.add(nativeRequest);


        String jsonResponse = new Gson().toJson(requests);
        sharedPrefs.edit().putString(NATIVE_REQUESTS, jsonResponse).apply();

        return response;
    }
}