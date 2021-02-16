package com.imranmentese.reactnativenetwatch.model;

import org.apache.commons.text.StringEscapeUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import okhttp3.Request;
import okhttp3.Response;

import static com.imranmentese.reactnativenetwatch.RNNetwatchModule.HTTP_COMPLETE_STATUS;

/**
 * Created by MENTESE Imran on 16/02/2021.
 */

public class NativeRequest {
    int _id;
    int readyState;
    String url;
    String method;
    int status;
    long startTime;
    long endTime;
    Object requestHeaders;
    Object responseHeaders;
    String responseContentType;
    Object response;

    public NativeRequest(Response response, long startTime, long endTime) {
        if (response != null) {
            // From request
            this.method = response.request().method();
            this.url = response.request().url().url().toString();
            this.requestHeaders = response.request().headers();

            // From response
            this.status = response.code();

            Map<String, String> mapResponseHeaders = new HashMap<String, String>();
            for(String key: response.headers().names()){
                List<String> values = response.headers().values(key);
                if (values != null && values.size() > 0){
                    String value = response.headers().values(key).get(0);
                    if (value.length() > 0 && (value.charAt(0) != '{'  || value.charAt(value.length() - 1) != '}')) {
                        mapResponseHeaders.put(key, response.headers().values(key).get(0).replaceAll("\"", ""));
                    }
                }
            }
            this.responseHeaders = mapResponseHeaders;

            if (response.body() != null) {
                try {
                    this.response = response.body().string();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if (response.body().contentType() != null) {
                    responseContentType = response.body().contentType().toString();
                }
            }
        }
        this._id = new Random().nextInt(10000);
        this.startTime = startTime;
        this.endTime = endTime;
        this.readyState = HTTP_COMPLETE_STATUS;
    }
}
