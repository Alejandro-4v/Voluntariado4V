package com.example.aplicacionmovilvoluntaridado;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

// Importante: Asegúrate de que esta importación no esté en rojo tras sincronizar el gradle
import com.bumptech.glide.Glide;

import com.example.aplicacionmovilvoluntaridado.models.Actividad;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class RecyclerDataAdapter extends RecyclerView.Adapter<RecyclerDataAdapter.RecyclerDataHolder> {

    public interface OnItemClickListener {
        void onItemClick(Actividad actividad, int position, ImageView sharedImage);
    }

    private List<Actividad> listaActividades;
    private List<Actividad> listaOriginal;
    private final OnItemClickListener itemClickListener;

    public RecyclerDataAdapter(List<Actividad> listaActividades, OnItemClickListener itemClickListener) {
        this.listaActividades = listaActividades;
        this.listaOriginal = new ArrayList<>(listaActividades);
        this.itemClickListener = itemClickListener;
    }

    @NonNull
    @Override
    public RecyclerDataHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_actividad, parent, false);
        return new RecyclerDataHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerDataHolder holder, int position) {
        holder.assignData(listaActividades.get(position), itemClickListener);
    }

    @Override
    public int getItemCount() {
        return listaActividades.size();
    }

    public void setDatos(List<Actividad> nuevosDatos) {
        this.listaActividades = nuevosDatos;
        this.listaOriginal = new ArrayList<>(nuevosDatos);
        notifyDataSetChanged();
    }

    public void filtrar(String texto) {
        if (texto.length() == 0) {
            listaActividades = new ArrayList<>(listaOriginal);
        } else {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                listaActividades = listaOriginal.stream()
                        .filter(i -> i.getNombre().toLowerCase().contains(texto.toLowerCase()) ||
                                (i.getEntidadNombre() != null && i.getEntidadNombre().toLowerCase().contains(texto.toLowerCase())))
                        .collect(Collectors.toList());
            } else {
                List<Actividad> filtrada = new ArrayList<>();
                for (Actividad a : listaOriginal) {
                    if (a.getNombre().toLowerCase().contains(texto.toLowerCase())) {
                        filtrada.add(a);
                    }
                }
                listaActividades = filtrada;
            }
        }
        notifyDataSetChanged();
    }

    public static class RecyclerDataHolder extends RecyclerView.ViewHolder {
        // Variables corregidas para coincidir con tu XML conceptualmente
        ImageView imgActividad;
        TextView txtNombre;
        TextView txtEntidad;
        TextView txtFechaLugar; // En tu XML están juntos en 'tvItemDateLocation'

        public RecyclerDataHolder(@NonNull View itemView) {
            super(itemView);

            // CORRECCIÓN DE IDs SEGÚN TU XML (item_actividad.xml)
            imgActividad = itemView.findViewById(R.id.ivItemImage);           // Antes imgActividad
            txtNombre = itemView.findViewById(R.id.tvItemActivityName);       // Antes txtNombre
            txtEntidad = itemView.findViewById(R.id.tvItemEntityName);        // Antes txtEntidad
            txtFechaLugar = itemView.findViewById(R.id.tvItemDateLocation);   // Antes txtFecha y txtLugar por separado
        }

        public void assignData(Actividad actividad, OnItemClickListener listener) {
            txtNombre.setText(actividad.getNombre());
            txtEntidad.setText(actividad.getEntidadNombre());

            // Combinamos lugar y fecha porque tu XML solo tiene un campo para ambos
            String info = actividad.getLugar() + " - " + actividad.getFechaFormatted();
            txtFechaLugar.setText(info);

            // Asignar nombre de transición para la animación compartida
            imgActividad.setTransitionName("transition_image_" + actividad.getIdActividad());

            // Cargar imagen con Glide
            if (actividad.getImagenUrl() != null && !actividad.getImagenUrl().isEmpty()) {
                Glide.with(itemView.getContext())
                        .load(actividad.getImagenUrl())
                        .placeholder(R.drawable.ic_launcher_background)
                        .into(imgActividad);
            } else {
                // Es buena práctica poner una imagen por defecto si viene vacía
                imgActividad.setImageResource(R.drawable.ic_launcher_background);
            }

            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onItemClick(actividad, getAdapterPosition(), imgActividad);
                }
            });
        }
    }
}