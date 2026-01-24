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
                    List<Actividad> pasadas = new ArrayList<>();
                    
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    java.util.Date now = new java.util.Date();

                    for (Actividad a : todas) {
                         if (a.getInicio() != null) {
                             try {
                                 // Handle potential T separator and timezone if needed, 
                                 // assuming standard format "yyyy-MM-dd HH:mm:ss" which is common
                                 // The user screenshot showed +00:00, so we might need to handle that.
                                 // Let's clean the string first to be safe or use a robust formatter
                                 String dateStr = a.getInicio().replace("T", " ");
                                 // Remove timezone if present for simple comparison or match format
                                 if (dateStr.contains("+")) {
                                     dateStr = dateStr.substring(0, dateStr.indexOf("+"));
                                 }
                                 
                                 java.util.Date activityDate = sdf.parse(dateStr);
                                 if (activityDate != null && activityDate.before(now)) {
                                     pasadas.add(a);
                                 }
                             } catch (java.text.ParseException e) {
                                 e.printStackTrace();
                                 // If parse fails, maybe keep it or discard? Safe to discard if we can't verify date.
                             }
                         }
                    }

                    if (adapter != null) adapter.setDatos(pasadas);
                    
                    android.widget.TextView tvEmpty = getView().findViewById(R.id.tvEmptyState);
                    // Update empty state check based on filtered list
                    if (pasadas.isEmpty()) {
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