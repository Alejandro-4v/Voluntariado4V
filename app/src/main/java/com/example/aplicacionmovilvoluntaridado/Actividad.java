package com.example.aplicacionmovilvoluntaridado;

public class Actividad {
    private String nombre;
    private String entidad;
    private String fecha;

    public Actividad(String nombre, String entidad, String fecha) {
        this.nombre = nombre;
        this.entidad = entidad;
        this.fecha = fecha;
    }

    public String getNombre() { return nombre; }
    public String getEntidad() { return entidad; }
    public String getFecha() { return fecha; }
}
