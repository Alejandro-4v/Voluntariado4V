package com.example.aplicacionmovilvoluntaridado.models;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class TipoActividad implements Serializable {
    @SerializedName("id_tipo_actividad")
    private int idTipoActividad;
    private String descripcion;
    @SerializedName("imagen_url")
    private String imagenUrl;

    // Getters and Setters
    public int getIdTipoActividad() {
        return idTipoActividad;
    }

    public void setIdTipoActividad(int idTipoActividad) {
        this.idTipoActividad = idTipoActividad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}
