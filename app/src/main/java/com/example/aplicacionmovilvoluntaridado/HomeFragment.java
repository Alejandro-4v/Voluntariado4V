package com.example.aplicacionmovilvoluntaridado;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aplicacionmovilvoluntaridado.models.Actividad;
import com.example.aplicacionmovilvoluntaridado.models.Voluntario;
import com.example.aplicacionmovilvoluntaridado.network.ApiClient;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeFragment extends Fragment {

    private TextView tvTotalHours;
    private TextView tvTotalActivities;
    private RecyclerView rvMyActivities;
    private View cardEmptyState;
    private RecyclerDataAdapter adapter;

    public HomeFragment() {
        // Required empty public constructor
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // 1. Personalizar saludo
        TextView tvUserName = view.findViewById(R.id.tvUserName);
        String nif = null;

        if (getActivity() != null) {
            SharedPreferences prefs = requireActivity().getSharedPreferences("VoluntariadoPrefs", Context.MODE_PRIVATE);
            String userName = prefs.getString("user_name", "Voluntario");
            nif = prefs.getString("user_nif", null);
            if (tvUserName != null) {
                tvUserName.setText(userName);
            }
        }

        // 2. Bind Stats & Lists
        tvTotalHours = view.findViewById(R.id.tvTotalHours);
        tvTotalActivities = view.findViewById(R.id.tvTotalActivities);
        rvMyActivities = view.findViewById(R.id.rvMyActivities);
        cardEmptyState = view.findViewById(R.id.cardEmptyState);

        rvMyActivities.setLayoutManager(new LinearLayoutManager(getContext()));
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
                 intent.putExtra("listaOds", (ArrayList<com.example.aplicacionmovilvoluntaridado.models.Ods>) actividad.getOds());
                 intent.putExtra("actividad_object", actividad);
                 startActivity(intent);
            }
        });
        rvMyActivities.setAdapter(adapter);


        // 3. Configurar botones de navegación
        Button btnFindActivities = view.findViewById(R.id.btnFindActivities);
        View cardExplore = view.findViewById(R.id.cardExplore);
        View cardHistory = view.findViewById(R.id.cardHistory);

        View.OnClickListener goToUpcoming = v -> {
            if (getActivity() instanceof ActividadesActivity) {
                ((ActividadesActivity) getActivity()).viewPager.setCurrentItem(1, true);
            }
        };

        if (btnFindActivities != null) {
            btnFindActivities.setOnClickListener(goToUpcoming);
        }
        if (cardExplore != null) {
            cardExplore.setOnClickListener(goToUpcoming);
        }

        if (cardHistory != null) {
            cardHistory.setOnClickListener(v -> {
                if (getActivity() instanceof ActividadesActivity) {
                    ((ActividadesActivity) getActivity()).viewPager.setCurrentItem(2, true);
                }
            });
        }

        // 4. Fetch Data
        if (nif != null) {
            android.util.Log.d("DashboardDebug", "Loading data for NIF: " + nif);
            loadUserData(nif);
        } else {
             android.util.Log.e("DashboardDebug", "NIF is null in SharedPreferences");
             Toast.makeText(getContext(), "Error: Usuario no identificado (NIF nulo)", Toast.LENGTH_LONG).show();
        }

        return view;
    }

    private void loadUserData(String nif) {
        // Fetch ALL activities and filter client-side (Angular logic)
        ApiClient.getApiService(getContext()).getActividades(null, null, null, null, null, null).enqueue(new Callback<List<Actividad>>() {
            @Override
            public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Actividad> allActivities = response.body();
                    List<Actividad> myActivities = new ArrayList<>();
                    
                    android.util.Log.d("DashboardDebug", "Fetched total activities: " + allActivities.size());

                    // Filter client-side
                    for (Actividad act : allActivities) {
                         if (act.getVoluntarios() != null) {
                             for (com.example.aplicacionmovilvoluntaridado.models.VoluntarioActividad v : act.getVoluntarios()) {
                                 if (v.getNif() != null && v.getNif().equalsIgnoreCase(nif)) {
                                     myActivities.add(act);
                                     break;
                                 }
                             }
                         }
                    }
                    
                    android.util.Log.d("DashboardDebug", "Filtered activities for user: " + myActivities.size());

                    // Update Stats
                    int count = myActivities.size();
                    tvTotalActivities.setText(String.valueOf(count));
                    
                    // Mock calculation for hours (e.g. 2 hours per activity)
                    tvTotalHours.setText(String.valueOf(count * 2)); 

                    // Update List
                    if (count > 0) {
                        rvMyActivities.setVisibility(View.VISIBLE);
                        cardEmptyState.setVisibility(View.GONE);
                        adapter.setDatos(myActivities);
                    } else {
                        rvMyActivities.setVisibility(View.GONE);
                        cardEmptyState.setVisibility(View.VISIBLE);
                    }

                } else {
                     android.util.Log.e("DashboardDebug", "API Error: " + response.code());
                    Toast.makeText(getContext(), "Error cargando dashboard", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Actividad>> call, Throwable t) {
                android.util.Log.e("DashboardDebug", "API Connection Failure: " + t.getMessage());
                 Toast.makeText(getContext(), "Error conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
