package com.example.aplicacionmovilvoluntaridado;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.aplicacionmovilvoluntaridado.models.Actividad;
import com.example.aplicacionmovilvoluntaridado.network.ApiClient;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PasadasActividadesFragment extends Fragment {

    public interface OnPasadasActividadSelectedListener {
        void onPasadasActividadSelected(Actividad actividad, ImageView sharedImage);
    }

    private OnPasadasActividadSelectedListener listener;
    private RecyclerView recyclerView;
    private RecyclerDataAdapter adapter;
    private View progressBar;

    public PasadasActividadesFragment() {
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnPasadasActividadSelectedListener) {
            listener = (OnPasadasActividadSelectedListener) context;
        } else {
            throw new ClassCastException(context.toString() + " debe implementar OnPasadasActividadSelectedListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        listener = null;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_lista_actividades, container, false);

        // --- CORRECCIÓN AQUÍ: Usamos el ID correcto 'rvActividades' ---
        recyclerView = view.findViewById(R.id.rvActividades);
        progressBar = view.findViewById(R.id.progressBar);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        adapter = new RecyclerDataAdapter(new ArrayList<>(), (actividad, position, sharedImage) -> {
            if (listener != null) {
                listener.onPasadasActividadSelected(actividad, sharedImage);
            }
        });
        recyclerView.setAdapter(adapter);

        cargarDatos();
        return view;
    }

    private void cargarDatos() {
        if (progressBar != null) progressBar.setVisibility(View.VISIBLE);

        ApiClient.getApiService(getContext()).getActividades(null, null, null, null, null, null).enqueue(new Callback<List<Actividad>>() {
            @Override
            public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    List<Actividad> todas = response.body();
                    // Lógica placeholder: mostrar todas.
                    // Deberías filtrar las que ya pasaron por fecha.
                    if (adapter != null) adapter.setDatos(todas);

                    // Empty State Logic
                    android.widget.TextView tvEmpty = getView().findViewById(R.id.tvEmptyState);
                    if (todas.isEmpty()) {
                        recyclerView.setVisibility(View.GONE);
                        if(tvEmpty != null) tvEmpty.setVisibility(View.VISIBLE);
                    } else {
                        recyclerView.setVisibility(View.VISIBLE);
                        if(tvEmpty != null) tvEmpty.setVisibility(View.GONE);
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Actividad>> call, Throwable t) {
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                if (getContext() != null) {
                    Toast.makeText(getContext(), "Error conexión", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    public void filtrarLista(String texto) {
        if (adapter != null) {
            adapter.filtrar(texto);
        }
    }
}