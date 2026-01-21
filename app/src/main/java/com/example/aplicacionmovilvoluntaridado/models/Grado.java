package com.example.aplicacionmovilvoluntaridado.models;

import java.io.Serializable;

public class Grado implements Serializable {
    private int idGrado;
    private String nivel; // "M" or "S"
    private String descripcion;

    // Getters and Setters
    public int getIdGrado() {
        return idGrado;
    }

    public void setIdGrado(int idGrado) {
        this.idGrado = idGrado;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
