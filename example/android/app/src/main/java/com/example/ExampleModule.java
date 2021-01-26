package com.example;

import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class ExampleModule extends ReactContextBaseJavaModule {
    ReactApplicationContext mContext;
    ExampleModule(ReactApplicationContext context) {
        super(context);
        mContext = context;
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
        List<String> jsonResponses = new ArrayList<>();

        RequestQueue requestQueue = Volley.newRequestQueue(mContext);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.i("NetwatchExampleModule", "<<>> Success response: " + response);
//                try {
//                    JSONArray jsonArray = response.getJSONArray("data");
//                    for(int i = 0; i < jsonArray.length(); i++){
//                        JSONObject jsonObject = jsonArray.getJSONObject(i);
//                        String email = jsonObject.getString("email");
//
//                        jsonResponses.add(email);
//                    }
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("NetwatchExampleModule", "<<>> Error: " + error);
                error.printStackTrace();
            }
        });
        requestQueue.add(jsonObjectRequest);
    }
}
