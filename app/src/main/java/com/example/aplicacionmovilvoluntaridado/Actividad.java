package com.example.aplicacionmovilvoluntaridado;

public class Actividad {
    private String nombre;
    private String entidad;
    private String fecha;
    private String lugar;
    private String descripcion;
    private int plazasTotales;

    public Actividad(String nombre, String entidad, String fecha, String lugar, String descripcion, int plazasTotales) {
        this.nombre = nombre;
        this.entidad = entidad;
        this.fecha = fecha;
        this.lugar = lugar;
        this.descripcion = descripcion;
        this.plazasTotales = plazasTotales;
    }

    public String getNombre() { return nombre; }
    public String getEntidad() { return entidad; }
    public String getFecha() { return fecha; }
    public String getLugar() { return lugar; }
    public String getDescripcion() { return descripcion; }
    public int getPlazasTotales() { return plazasTotales; }
}
