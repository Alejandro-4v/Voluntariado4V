package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.aplicacionmovilvoluntaridado.models.Actividad;
import com.example.aplicacionmovilvoluntaridado.network.ApiClient;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import android.widget.ProgressBar;

public class PasadasActividadesFragment extends Fragment {
    RecyclerDataAdapter adapter;
    ProgressBar progressBar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_lista_actividades, container, false);

        RecyclerView recyclerView = view.findViewById(R.id.rvActividades);
        progressBar = view.findViewById(R.id.progressBar); // Init ProgressBar
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        adapter = new RecyclerDataAdapter(new ArrayList<>(), new ActividadClickListener());
        recyclerView.setAdapter(adapter);

        cargarDatos();

        return view;
    }

    private void cargarDatos() {
        progressBar.setVisibility(View.VISIBLE); // Show
        ApiClient.getApiService().getActividades(50, null, null, null, null, null)
                .enqueue(new Callback<List<Actividad>>() {
                    @Override
                    public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                        progressBar.setVisibility(View.GONE); // Hide
                        if (response.isSuccessful() && response.body() != null) {
                            List<Actividad> todas = response.body();
                            List<Actividad> pasadas = new ArrayList<>();

                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
                            String ahora = sdf.format(new Date());

                            for (Actividad a : todas) {
                                if (a.getInicio() != null && a.getInicio().compareTo(ahora) <= 0) {
                                    pasadas.add(a);
                                }
                            }
                            adapter.setDatos(pasadas);
                        } else {
                            Toast.makeText(getContext(), "Error: " + response.code(), Toast.LENGTH_LONG).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<Actividad>> call, Throwable t) {
                        progressBar.setVisibility(View.GONE); // Hide
                        Toast.makeText(getContext(), "Fallo: " + t.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
    }

    public void filtrarLista(String texto) {
        if (adapter != null) {
            adapter.filtrar(texto);
        }
    }

    private class ActividadClickListener implements RecyclerDataAdapter.OnItemClickListener {
        @Override
        public void onItemClick(Actividad actividad, int position) {
            Intent intent = new Intent(getContext(), DetalleActividadActivity.class);
            intent.putExtra("nombre", actividad.getNombre());
            intent.putExtra("entidad", actividad.getEntidadNombre());
            intent.putExtra("fecha", actividad.getFechaFormatted());
            intent.putExtra("lugar", actividad.getLugar());
            intent.putExtra("descripcion", actividad.getDescripcion());
            intent.putExtra("plazas", 0);
            intent.putExtra("listaOds",
                    (ArrayList<com.example.aplicacionmovilvoluntaridado.models.Ods>) actividad.getOds());
            startActivity(intent);
        }
    }
}