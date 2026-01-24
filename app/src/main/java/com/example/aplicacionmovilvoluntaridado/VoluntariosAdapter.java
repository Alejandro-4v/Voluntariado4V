package com.example.aplicacionmovilvoluntaridado;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aplicacionmovilvoluntaridado.models.Voluntario;

import java.util.ArrayList;
import java.util.List;

public class VoluntariosAdapter extends RecyclerView.Adapter<VoluntariosAdapter.ViewHolder> {

    private List<Voluntario> voluntarios;
    private List<Voluntario> listaOriginal;

    public VoluntariosAdapter() {
        this.voluntarios = new ArrayList<>();
        this.listaOriginal = new ArrayList<>();
    }

    public void setDatos(List<Voluntario> datos) {
        this.voluntarios = datos;
        this.listaOriginal = new ArrayList<>(datos);
        notifyDataSetChanged();
    }
    
    public void filtrar(String texto) {
        if (texto.isEmpty()) {
            voluntarios = new ArrayList<>(listaOriginal);
        } else {
            List<Voluntario> filtrada = new ArrayList<>();
            String busqueda = texto.toLowerCase();
            for (Voluntario v : listaOriginal) {
                boolean coincideNombre = v.getNombre() != null && v.getNombre().toLowerCase().contains(busqueda);
                boolean coincideApellido1 = v.getApellido1() != null && v.getApellido1().toLowerCase().contains(busqueda);
                boolean coincideApellido2 = v.getApellido2() != null && v.getApellido2().toLowerCase().contains(busqueda);
                boolean coincideEmail = v.getMail() != null && v.getMail().toLowerCase().contains(busqueda);
                boolean coincideNif = v.getNif() != null && v.getNif().toLowerCase().contains(busqueda);

                if (coincideNombre || coincideApellido1 || coincideApellido2 || coincideEmail || coincideNif) {
                    filtrada.add(v);
                }
            }
            voluntarios = filtrada;
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_voluntario, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Voluntario v = voluntarios.get(position);
        
        String nombreCompleto = (v.getNombre() != null ? v.getNombre() : "") + " " + 
                                (v.getApellido1() != null ? v.getApellido1() : "") + " " +
                                (v.getApellido2() != null ? v.getApellido2() : "");
                                
        holder.tvName.setText(nombreCompleto.trim());
        holder.tvEmail.setText(v.getMail());
        holder.tvNif.setText(v.getNif());
        if (v.getGrado() != null) {
            holder.tvGrado.setText(v.getGrado().getDescripcion());
        } else {
            holder.tvGrado.setText("Sin grado");
        }
        
         
        String estado = v.getEstado() != null ? v.getEstado() : "?";
        String estadoLabel = estado;
        int color = android.graphics.Color.GRAY;
        
        if ("A".equals(estado)) {
            estadoLabel = "Activo";
            color = android.graphics.Color.parseColor("#4CAF50");  
        } else if ("P".equals(estado)) {
             estadoLabel = "Pendiente";
             color = android.graphics.Color.parseColor("#FF9800");  
        } else if ("I".equals(estado)) {
             estadoLabel = "Inactivo";
             color = android.graphics.Color.GRAY;
        } else if ("R".equals(estado)) {
             estadoLabel = "Rechazado";
             color = android.graphics.Color.RED;
        }
        
        holder.tvEstado.setText(estadoLabel);
        holder.tvEstado.setTextColor(color);
    }

    @Override
    public int getItemCount() {
        return voluntarios.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvEmail, tvNif, tvGrado, tvEstado;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvVoluntarioName);
            tvEmail = itemView.findViewById(R.id.tvVoluntarioEmail);
            tvNif = itemView.findViewById(R.id.tvVoluntarioNif);
            tvGrado = itemView.findViewById(R.id.tvVoluntarioGrado);
            tvEstado = itemView.findViewById(R.id.tvVoluntarioEstado);
        }
    }
}
