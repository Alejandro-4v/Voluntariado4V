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

public class ProximasActividadesFragment extends Fragment {

    public interface OnProximasActividadSelectedListener {
        void onProximasActividadSelected(Actividad actividad, ImageView sharedImage);
    }

    private OnProximasActividadSelectedListener listener;
    private RecyclerView recyclerView;
    private RecyclerDataAdapter adapter;
    private View progressBar;

    public ProximasActividadesFragment() {
         
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnProximasActividadSelectedListener) {
            listener = (OnProximasActividadSelectedListener) context;
        } else {
            throw new ClassCastException(context.toString() + " debe implementar OnProximasActividadSelectedListener");
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
                listener.onProximasActividadSelected(actividad, sharedImage);
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
                    List<Actividad> proximas = new ArrayList<>();

                     
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    java.util.Date now = new java.util.Date();

                    for (Actividad a : todas) {
                         if (a.getInicio() != null) {
                             try {
                                 String dateStr = a.getInicio().replace("T", " ");
                                 if (dateStr.contains("+")) {
                                     dateStr = dateStr.substring(0, dateStr.indexOf("+"));
                                 }
                                 
                                 java.util.Date activityDate = sdf.parse(dateStr);
                                 // "Upcoming" means future or present? Usually >= now.
                                 if (activityDate != null && (activityDate.after(now) || activityDate.equals(now))) {
                                     proximas.add(a);
                                 }
                             } catch (java.text.ParseException e) {
                                 e.printStackTrace();
                             }
                         }
                    }

                    if (adapter != null) adapter.setDatos(proximas);

                     
                    android.widget.TextView tvEmpty = getView().findViewById(R.id.tvEmptyState);
                    if (proximas.isEmpty()) {
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