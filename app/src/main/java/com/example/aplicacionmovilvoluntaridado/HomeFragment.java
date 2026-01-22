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

    // Loading Views
    private View progressBar;
    private View contentLayout;
    private androidx.swiperefreshlayout.widget.SwipeRefreshLayout swipeRefresh;

    public HomeFragment() {
        // Required empty public constructor
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // Bind Loading Views
        progressBar = view.findViewById(R.id.progressBar);
        contentLayout = view.findViewById(R.id.contentLayout);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);

        // Initial State: Loading (only if not refreshing)
        progressBar.setVisibility(View.VISIBLE);
        contentLayout.setVisibility(View.GONE);

        // ... existing bindings (tvUserName, etc.) ...

        // 1. Personalizar saludo
        TextView tvUserName = view.findViewById(R.id.tvUserName);
        final String nifVal = (getActivity() != null)
            ? requireActivity().getSharedPreferences("VoluntariadoPrefs", Context.MODE_PRIVATE).getString("user_nif", null)
            : null;
        String userName = (getActivity() != null)
            ? requireActivity().getSharedPreferences("VoluntariadoPrefs", Context.MODE_PRIVATE).getString("user_name", "Voluntario")
            : "Voluntario";

        if (tvUserName != null) {
            tvUserName.setText(userName);
        }

        // Setup Swipe Refresh
        if (swipeRefresh != null) {
            swipeRefresh.setColorSchemeResources(R.color.colorPrimary);
            swipeRefresh.setOnRefreshListener(new androidx.swiperefreshlayout.widget.SwipeRefreshLayout.OnRefreshListener() {
                @Override
                public void onRefresh() {
                    if (nifVal != null) {
                        loadUserData(nifVal, false); // false = don't show full screen progress
                    } else {
                        swipeRefresh.setRefreshing(false);
                    }
                }
            });
        }

        // ... (rest of binding code) ...

        // 2. Bind Stats & Lists
        tvTotalHours = view.findViewById(R.id.tvTotalHours);
        tvTotalActivities = view.findViewById(R.id.tvTotalActivities);
        rvMyActivities = view.findViewById(R.id.rvMyActivities);
        cardEmptyState = view.findViewById(R.id.cardEmptyState);

        rvMyActivities.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new RecyclerDataAdapter(new ArrayList<>(), new RecyclerDataAdapter.OnItemClickListener() {
             @Override
              public void onItemClick(Actividad actividad, int position, android.widget.ImageView sharedImage) {
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
                 
                 androidx.core.app.ActivityOptionsCompat options = androidx.core.app.ActivityOptionsCompat.makeSceneTransitionAnimation(
                     getActivity(), sharedImage, "transition_image_" + actividad.getIdActividad());
                 
                 startActivity(intent, options.toBundle());
              }
        });
        rvMyActivities.setAdapter(adapter);

        // ... (rest of button listeners) ...
        Button btnFindActivities = view.findViewById(R.id.btnFindActivities);
        View cardExplore = view.findViewById(R.id.cardExplore);
        View cardHistory = view.findViewById(R.id.cardHistory);

        View.OnClickListener goToUpcoming = v -> {
            if (getActivity() instanceof ActividadesActivity) {
                ((ActividadesActivity) getActivity()).viewPager.setCurrentItem(1, true);
            }
        };

        if (btnFindActivities != null) btnFindActivities.setOnClickListener(goToUpcoming);
        if (cardExplore != null) cardExplore.setOnClickListener(goToUpcoming);
        if (cardHistory != null) cardHistory.setOnClickListener(v -> ((ActividadesActivity) getActivity()).viewPager.setCurrentItem(2, true));


        // 4. Fetch Data
        if (nifVal != null) {
            android.util.Log.d("DashboardDebug", "Loading data for NIF: " + nifVal);
            loadUserData(nifVal, true); // true = show full screen progress initially
        } else {
             android.util.Log.e("DashboardDebug", "NIF is null in SharedPreferences");
             progressBar.setVisibility(View.GONE);
             Toast.makeText(getContext(), "Error: Usuario no identificado (NIF nulo)", Toast.LENGTH_LONG).show();
             // Consider showing error state or redirecting to login
        }

        return view;
    }

    private void loadUserData(String nif, boolean showFullScreenLoading) {
        if (showFullScreenLoading) {
            if (progressBar != null) progressBar.setVisibility(View.VISIBLE);
            if (contentLayout != null) contentLayout.setVisibility(View.GONE);
        }

        // Fetch ALL activities and filter client-side (Angular logic)
        ApiClient.getApiService(getContext()).getActividades(null, null, null, null, null, null).enqueue(new Callback<List<Actividad>>() {
            @Override
            public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                // Hide Loading specific controls
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                if (contentLayout != null) contentLayout.setVisibility(View.VISIBLE);
                if (swipeRefresh != null) swipeRefresh.setRefreshing(false);

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
                    if (tvTotalActivities != null) tvTotalActivities.setText(String.valueOf(count));
                    
                    // Mock calculation for hours (e.g. 2 hours per activity)
                    if (tvTotalHours != null) tvTotalHours.setText(String.valueOf(count * 2)); 

                    // Update List
                    if (count > 0) {
                        if (rvMyActivities != null) rvMyActivities.setVisibility(View.VISIBLE);
                        if (cardEmptyState != null) cardEmptyState.setVisibility(View.GONE);
                        if (adapter != null) adapter.setDatos(myActivities);
                    } else {
                        if (rvMyActivities != null) rvMyActivities.setVisibility(View.GONE);
                        if (cardEmptyState != null) cardEmptyState.setVisibility(View.VISIBLE);
                    }

                } else {
                     android.util.Log.e("DashboardDebug", "API Error: " + response.code());
                     Toast.makeText(getContext(), "Error cargando dashboard", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Actividad>> call, Throwable t) {
                // Hide Loading, Show Content (even if error, maybe show cached data or empty state)
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                if (contentLayout != null) contentLayout.setVisibility(View.VISIBLE); // Or show specific error view
                if (swipeRefresh != null) swipeRefresh.setRefreshing(false);

                android.util.Log.e("DashboardDebug", "API Connection Failure: " + t.getMessage());
                Toast.makeText(getContext(), "Error conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
