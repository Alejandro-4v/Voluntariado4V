package com.example.aplicacionmovilvoluntaridado.models;

import java.io.Serializable;
import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Actividad implements Serializable {
    private int idActividad;
    private String nombre;
    private String descripcion;
    private String estado;
    private EntidadActividad convoca;
    private String inicio; // ISO 8601 string
    private String fin; // ISO 8601 string
    private String imagenUrl;
    private Grado grado;
    private List<TipoActividad> tiposActividad;
    private List<Ods> ods;
    private List<VoluntarioActividad> voluntarios;

    // Future optional field
    private String lugar;

    // Helper methods for UI compatibility or formatting
    public String getEntidadNombre() {
        return convoca != null ? convoca.getNombre() : "";
    }

    // Formatted date string (could be improved with a proper Date formatter)
    public String getFechaFormatted() {
        return inicio != null ? inicio.replace("T", " ") : "";
    }

    // Getters and Setters
    public int getIdActividad() {
        return idActividad;
    }

    public void setIdActividad(int idActividad) {
        this.idActividad = idActividad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public EntidadActividad getConvoca() {
        return convoca;
    }

    public void setConvoca(EntidadActividad convoca) {
        this.convoca = convoca;
    }

    public String getInicio() {
        return inicio;
    }

    public void setInicio(String inicio) {
        this.inicio = inicio;
    }

    public String getFin() {
        return fin;
    }

    public void setFin(String fin) {
        this.fin = fin;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Grado getGrado() {
        return grado;
    }

    public void setGrado(Grado grado) {
        this.grado = grado;
    }

    public List<TipoActividad> getTiposActividad() {
        return tiposActividad;
    }

    public void setTiposActividad(List<TipoActividad> tiposActividad) {
        this.tiposActividad = tiposActividad;
    }

    public List<Ods> getOds() {
        return ods;
    }

    public void setOds(List<Ods> ods) {
        this.ods = ods;
    }

    public List<VoluntarioActividad> getVoluntarios() {
        return voluntarios;
    }

    public void setVoluntarios(List<VoluntarioActividad> voluntarios) {
        this.voluntarios = voluntarios;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }
}
