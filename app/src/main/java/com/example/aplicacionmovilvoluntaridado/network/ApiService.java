package com.example.aplicacionmovilvoluntaridado.network;

import com.example.aplicacionmovilvoluntaridado.models.Actividad;
import com.example.aplicacionmovilvoluntaridado.models.LogIn;
import com.example.aplicacionmovilvoluntaridado.models.Token;
import com.example.aplicacionmovilvoluntaridado.models.Voluntario;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ApiService {

    @POST("login")
    Call<Token> login(@Body LogIn login, @Query("usuario") String usuario);

    @GET("actividad")
    Call<List<Actividad>> getActividades(
            @Query("limit") Integer limit,
            @Query("nombre") String nombre,
            @Query("estado") String estado,
            @Query("convoca") Integer idEntidad,
            @Query("fecha") String fecha,
            @Query("grado") Integer idGrado
     
    );
    @GET("voluntario/{nif}")
    Call<Voluntario> getVoluntario(@retrofit2.http.Path("nif") String nif);

    @GET("voluntario")
    Call<List<Voluntario>> getVoluntarios();
}
