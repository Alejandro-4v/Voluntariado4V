package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import android.widget.ProgressBar;

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

public class AdminPasadasFragment extends Fragment {
    RecyclerDataAdapter adapter;
    ProgressBar progressBar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_lista_actividades, container, false);

        RecyclerView recyclerView = view.findViewById(R.id.rvActividades);
        progressBar = view.findViewById(R.id.progressBar);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        adapter = new RecyclerDataAdapter(new ArrayList<>(), new RecyclerDataAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Actividad actividad, int position) {
                 Intent intent = new Intent(getContext(), DetalleActividadActivity.class);
                intent.putExtra("nombre", actividad.getNombre());
                intent.putExtra("entidad", actividad.getEntidadNombre());
                intent.putExtra("fecha", actividad.getFechaFormatted());
                intent.putExtra("lugar", actividad.getLugar());
                intent.putExtra("descripcion", actividad.getDescripcion());
                intent.putExtra("plazas", actividad.getPlazas());
                 intent.putExtra("imagenUrl", actividad.getImagenUrl());
                intent.putExtra("listaOds",
                        (ArrayList<com.example.aplicacionmovilvoluntaridado.models.Ods>) actividad.getOds());
                startActivity(intent);
            }
        });
        recyclerView.setAdapter(adapter);

        cargarDatos();

        return view;
    }

    private void cargarDatos() {
        progressBar.setVisibility(View.VISIBLE);
        ApiClient.getApiService(getContext()).getActividades(50, null, null, null, null, null)
                .enqueue(new Callback<List<Actividad>>() {
                    @Override
                    public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                        progressBar.setVisibility(View.GONE);
                        if (response.isSuccessful() && response.body() != null) {
                            List<Actividad> todas = response.body();
                            List<Actividad> pasadas = new ArrayList<>();

                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
                            String ahora = sdf.format(new Date());

                            for (Actividad a : todas) {
                                String inicioStr = a.getInicio() != null ? a.getInicio().replace("T", " ") : "";
                                String ahoraStr = ahora.replace("T", " ");

                                if (inicioStr.compareTo(ahoraStr) <= 0) {
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
                         progressBar.setVisibility(View.GONE);
                        Toast.makeText(getContext(), "Fallo: " + t.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
    }
}
