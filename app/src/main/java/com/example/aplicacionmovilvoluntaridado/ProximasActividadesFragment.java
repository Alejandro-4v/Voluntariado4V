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

public class ProximasActividadesFragment extends Fragment {
    RecyclerDataAdapter adapter;
    ProgressBar progressBar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        // Reutilizamos el layout que ya tenías para la lista o creamos uno simple con
        // solo el RecyclerView
        // Para simplificar, supongamos que tienes un layout 'fragment_lista.xml' con un
        // RecyclerView dentro
        View view = inflater.inflate(R.layout.fragment_lista_actividades, container, false); // Crea este xml con solo
                                                                                             // el RecyclerView

        RecyclerView recyclerView = view.findViewById(R.id.rvActividades);
        progressBar = view.findViewById(R.id.progressBar); // Initialize ProgressBar
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        // Inicializamos con lista vacía
        adapter = new RecyclerDataAdapter(new ArrayList<>(), new RecyclerDataAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Actividad actividad, int position) {
                // Lógica de abrir detalle
                Intent intent = new Intent(getContext(), DetalleActividadActivity.class);
                intent.putExtra("nombre", actividad.getNombre());
                intent.putExtra("entidad", actividad.getEntidadNombre());
                intent.putExtra("fecha", actividad.getFechaFormatted());
                intent.putExtra("lugar", actividad.getLugar());
                intent.putExtra("descripcion", actividad.getDescripcion());
                intent.putExtra("plazas", 0); // No disponible en API actual
                intent.putExtra("listaOds",
                        (ArrayList<com.example.aplicacionmovilvoluntaridado.models.Ods>) actividad.getOds());
                startActivity(intent);
            }
        });
        recyclerView.setAdapter(adapter);

        // Cargar datos de la API
        cargarDatos();

        return view;

    }

    private void cargarDatos() {
        progressBar.setVisibility(View.VISIBLE); // Show loading
        ApiClient.getApiService(getContext()).getActividades(50, null, null, null, null, null)
                .enqueue(new Callback<List<Actividad>>() {
                    @Override
                    public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                        progressBar.setVisibility(View.GONE); // Hide loading
                        if (response.isSuccessful() && response.body() != null) {
                            List<Actividad> todas = response.body();
                            List<Actividad> proximas = new ArrayList<>();

                            // Filtrar por fecha > hoy
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
                            String ahora = sdf.format(new Date());

                            for (Actividad a : todas) {
                                // Comparación lexicográfica de ISO 8601 funciona
                                if (a.getInicio() != null && a.getInicio().compareTo(ahora) > 0) {
                                    proximas.add(a);
                                }
                            }
                            adapter.setDatos(proximas);
                        } else {
                            // Mostrar código de error para depuración
                            Toast.makeText(getContext(), "Error: " + response.code() + " " + response.message(),
                                    Toast.LENGTH_LONG).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<Actividad>> call, Throwable t) {
                        progressBar.setVisibility(View.GONE); // Hide loading
                        // Mostrar mensaje de excepción
                        Toast.makeText(getContext(), "Fallo: " + t.getMessage(), Toast.LENGTH_LONG).show();
                        t.printStackTrace(); // Para ver en Logcat si es posible
                    }
                });
    }

    public void filtrarLista(String texto) {
        if (adapter != null) {
            adapter.filtrar(texto);
        }
    }
}