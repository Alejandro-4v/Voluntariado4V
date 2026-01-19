package com.example.aplicacionmovilvoluntaridado.models;

import java.io.Serializable;
import com.google.gson.annotations.SerializedName;

public class Ods implements Serializable {
    @SerializedName("id_ods")
    private int idOds;
    private String descripcion;
    @SerializedName("imagen_url")
    private String imagenUrl;

    // Getters and Setters
    public int getIdOds() {
        return idOds;
    }

    public void setIdOds(int idOds) {
        this.idOds = idOds;
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
