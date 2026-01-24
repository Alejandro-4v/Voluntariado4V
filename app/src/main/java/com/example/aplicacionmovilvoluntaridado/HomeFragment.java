package com.example.aplicacionmovilvoluntaridado;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ImageView;  

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

public class HomeFragment extends Fragment {

     
     
    public interface OnActividadSelectedListener {
        void onActividadSelected(Actividad actividad, ImageView sharedImage);
    }

    private OnActividadSelectedListener listener;

    private TextView tvTotalHours;
    private TextView tvTotalActivities;
    private RecyclerView rvMyActivities;
    private View cardEmptyState;
    private RecyclerDataAdapter adapter;

     
    private View progressBar;
    private View contentLayout;
    private androidx.swiperefreshlayout.widget.SwipeRefreshLayout swipeRefresh;

    public HomeFragment() {
         
    }

     
    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof OnActividadSelectedListener) {
            listener = (OnActividadSelectedListener) context;
        } else {
            throw new ClassCastException(context.toString() + " debe implementar OnActividadSelectedListener");
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
        View view = inflater.inflate(R.layout.fragment_home, container, false);

         
        progressBar = view.findViewById(R.id.progressBar);
        contentLayout = view.findViewById(R.id.contentLayout);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);

         
        progressBar.setVisibility(View.VISIBLE);
        contentLayout.setVisibility(View.GONE);

         
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

         
        if (swipeRefresh != null) {
            swipeRefresh.setColorSchemeResources(R.color.colorPrimary);
            swipeRefresh.setOnRefreshListener(new androidx.swiperefreshlayout.widget.SwipeRefreshLayout.OnRefreshListener() {
                @Override
                public void onRefresh() {
                    if (nifVal != null) {
                        loadUserData(nifVal, false);
                    } else {
                        swipeRefresh.setRefreshing(false);
                    }
                }
            });
        }

         
        android.widget.ImageButton btnLogout = view.findViewById(R.id.btnLogoutFragment);
        if (btnLogout != null) {
            btnLogout.setOnClickListener(v -> {
                new androidx.appcompat.app.AlertDialog.Builder(getContext())
                        .setTitle("Cerrar sesión")
                        .setMessage("¿Estás seguro de que quieres salir?")
                        .setPositiveButton("Salir", (dialog, which) -> {
                            if (getActivity() != null) {
                                getActivity().getSharedPreferences("VoluntariadoPrefs", Context.MODE_PRIVATE).edit().clear().apply();
                                com.example.aplicacionmovilvoluntaridado.network.ApiClient.reset();
                                android.content.Intent intent = new android.content.Intent(getActivity(), LoginActivity.class);
                                intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                                getActivity().finish();
                            }
                        })
                        .setNegativeButton("Cancelar", null)
                        .show();
            });
        }

         
        tvTotalHours = view.findViewById(R.id.tvTotalHours);
        tvTotalActivities = view.findViewById(R.id.tvTotalActivities);
        rvMyActivities = view.findViewById(R.id.rvMyActivities);
        cardEmptyState = view.findViewById(R.id.cardEmptyState);

        rvMyActivities.setLayoutManager(new LinearLayoutManager(getContext()));

         
        adapter = new RecyclerDataAdapter(new ArrayList<>(), new RecyclerDataAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Actividad actividad, int position, ImageView sharedImage) {
                 
                if (listener != null) {
                    listener.onActividadSelected(actividad, sharedImage);
                }
            }
        });
        rvMyActivities.setAdapter(adapter);

         
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
        if (cardHistory != null) cardHistory.setOnClickListener(v -> {
            if (getActivity() instanceof ActividadesActivity) {
                ((ActividadesActivity) getActivity()).viewPager.setCurrentItem(2, true);
            }
        });

         
        if (nifVal != null) {
            loadUserData(nifVal, true);
        } else {
            progressBar.setVisibility(View.GONE);
            Toast.makeText(getContext(), "Error: Usuario no identificado", Toast.LENGTH_LONG).show();
        }

        return view;
    }

    private void loadUserData(String nif, boolean showFullScreenLoading) {
        if (showFullScreenLoading) {
            if (progressBar != null) progressBar.setVisibility(View.VISIBLE);
            if (contentLayout != null) contentLayout.setVisibility(View.GONE);
        }

        ApiClient.getApiService(getContext()).getActividades(null, null, null, null, null, null).enqueue(new Callback<List<Actividad>>() {
            @Override
            public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                if (contentLayout != null) contentLayout.setVisibility(View.VISIBLE);
                if (swipeRefresh != null) swipeRefresh.setRefreshing(false);

                if (response.isSuccessful() && response.body() != null) {
                    List<Actividad> allActivities = response.body();
                    List<Actividad> myActivities = new ArrayList<>();

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

                    int count = myActivities.size();
                    if (tvTotalActivities != null) tvTotalActivities.setText(String.valueOf(count));
                    if (tvTotalHours != null) tvTotalHours.setText(String.valueOf(count * 2));

                    if (count > 0) {
                        if (rvMyActivities != null) rvMyActivities.setVisibility(View.VISIBLE);
                        if (cardEmptyState != null) cardEmptyState.setVisibility(View.GONE);
                        if (adapter != null) adapter.setDatos(myActivities);
                    } else {
                        if (rvMyActivities != null) rvMyActivities.setVisibility(View.GONE);
                        if (cardEmptyState != null) cardEmptyState.setVisibility(View.VISIBLE);
                    }

                } else {
                    Toast.makeText(getContext(), "Error cargando dashboard", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Actividad>> call, Throwable t) {
                if (progressBar != null) progressBar.setVisibility(View.GONE);
                if (contentLayout != null) contentLayout.setVisibility(View.VISIBLE);
                if (swipeRefresh != null) swipeRefresh.setRefreshing(false);
                Toast.makeText(getContext(), "Error conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}