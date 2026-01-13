package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;


public class ProximasActividadesFragment extends Fragment {
    RecyclerDataAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Reutilizamos el layout que ya tenías para la lista o creamos uno simple con solo el RecyclerView
        // Para simplificar, supongamos que tienes un layout 'fragment_lista.xml' con un RecyclerView dentro
        View view = inflater.inflate(R.layout.fragment_lista_actividades, container, false); // Crea este xml con solo el RecyclerView

        RecyclerView recyclerView = view.findViewById(R.id.rvActividades);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        ArrayList<Actividad> lista = new ArrayList<>();
        // DATOS DE PRÓXIMAS
        lista.add(new Actividad("Recogida Alimentos", "Banco", "15/10/2025", "Pamplona", "Desc...", 20));
        lista.add(new Actividad("Carrera Solidaria", "Anfas", "20/11/2025", "Centro", "Desc...", 100));

        adapter = new RecyclerDataAdapter(lista, new RecyclerDataAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Actividad actividad, int position) {
                // Lógica de abrir detalle (Igual que antes)
                Intent intent = new Intent(getContext(), DetalleActividadActivity.class);
                intent.putExtra("nombre", actividad.getNombre());
                // ... pasar resto de extras
                startActivity(intent);
            }
        });
        adapter.setDatos(lista);
        recyclerView.setAdapter(adapter);

        return view;

    }
    public void filtrarLista(String texto) {
        if (adapter != null) {
            adapter.filtrar(texto);
        }
    }


}