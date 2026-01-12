package com.example.aplicacionmovilvoluntaridado;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;

// [cite: 108] Heredamos de RecyclerView.Adapter y usamos nuestra clase interna RecyclerDataHolder
public class RecyclerDataAdapter extends RecyclerView.Adapter<RecyclerDataAdapter.RecyclerDataHolder> {

    // [cite: 203, 205] Atributos para la lista y el listener
    private ArrayList<Actividad> listData;
    private OnItemClickListener itemListener;

    // [cite: 206] Constructor que recibe la lista y el listener
    public RecyclerDataAdapter(ArrayList<Actividad> listData, OnItemClickListener listener) {
        this.listData = listData;
        this.itemListener = listener;
    }

    // [cite: 143] Inflamos la vista item_actividad
    @NonNull
    @Override
    public RecyclerDataHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // [cite: 149] Inflater con attachToRoot false
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_actividad, parent, false);
        return new RecyclerDataHolder(view);
    }

    // [cite: 231] Enlazamos datos pasando el objeto y el listener al método assignData
    @Override
    public void onBindViewHolder(@NonNull RecyclerDataHolder holder, int position) {
        holder.assignData(listData.get(position), itemListener);
    }

    // [cite: 167] Devolvemos el tamaño de la lista
    @Override
    public int getItemCount() {
        return listData.size();
    }

    // [cite: 107, 130] Clase interna Holder
    public class RecyclerDataHolder extends RecyclerView.ViewHolder {
        // [cite: 131] Referencias a los elementos visuales
        TextView tvNombre, tvEntidad, tvFecha;

        public RecyclerDataHolder(@NonNull View itemView) {
            super(itemView);
            // [cite: 134] Buscamos los IDs del XML item_actividad
            tvNombre = itemView.findViewById(R.id.tvItemActivityName);
            tvEntidad = itemView.findViewById(R.id.tvItemEntityName);
            tvFecha = itemView.findViewById(R.id.tvItemDateLocation);
        }

        //  Método assignData modificado para recibir datos y listener
        public void assignData(final Actividad actividad, final OnItemClickListener onItemClickListener) {
            // Asignamos los textos
            tvNombre.setText(actividad.getNombre());
            tvEntidad.setText(actividad.getEntidad());
            tvFecha.setText(actividad.getFecha());

            // [cite: 221] Configuramos el click en todo el elemento (itemView)
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    // [cite: 227] Devolvemos el objeto y la posición al listener
                    onItemClickListener.onItemClick(actividad, getAdapterPosition());
                }
            });
        }
    }

    //
    //   para manejar el click
    public interface OnItemClickListener {
        void onItemClick(Actividad actividad, int position);
    }
}