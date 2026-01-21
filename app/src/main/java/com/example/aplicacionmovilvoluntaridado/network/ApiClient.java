package com.example.aplicacionmovilvoluntaridado.network;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.FieldNamingPolicy;
import java.util.concurrent.TimeUnit;

public class ApiClient {

    private static final String BASE_URL = "http://10.0.2.2/";
    private static Retrofit retrofit = null;

    public static void reset() {
        retrofit = null;
    }

    public static ApiService getApiService(android.content.Context context) {
        if (retrofit == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
            httpClient.addInterceptor(logging);
            httpClient.connectTimeout(60, TimeUnit.SECONDS);
            httpClient.readTimeout(60, TimeUnit.SECONDS);
            httpClient.writeTimeout(60, TimeUnit.SECONDS);

            // Add Auth Interceptor
            android.content.Context appContext = context.getApplicationContext();
            httpClient.addInterceptor(chain -> {
                okhttp3.Request original = chain.request();
                okhttp3.Request.Builder requestBuilder = original.newBuilder();

                if (appContext != null) {
                    // Skip Auth header for Login requests
                    if (original.url().encodedPath().contains("/login")) {
                         return chain.proceed(original);
                    }

                    android.content.SharedPreferences prefs = appContext.getSharedPreferences("VoluntariadoPrefs",
                            android.content.Context.MODE_PRIVATE);
                    String token = prefs.getString("auth_token", null);
                    if (token != null) {
                        android.util.Log.d("ApiClient", "Adding Auth Header: " + token);
                        requestBuilder.header("Authorization", "Bearer " + token);
                    } else {
                        android.util.Log.e("ApiClient", "Token is NULL in SharedPreferences!");
                    }
                } else {
                    android.util.Log.e("ApiClient", "AppContext is NULL!");
                }

                okhttp3.Request request = requestBuilder.build();
                return chain.proceed(request);
            });

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build();
        }
        return retrofit.create(ApiService.class);
    }
}
