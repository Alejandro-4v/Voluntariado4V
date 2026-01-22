package com.example.aplicacionmovilvoluntaridado;

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

import com.example.aplicacionmovilvoluntaridado.models.Voluntario;
import com.example.aplicacionmovilvoluntaridado.network.ApiClient;

import java.util.List;
import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminVoluntariosFragment extends Fragment {
    
    VoluntariosAdapter adapter;
    ProgressBar progressBar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_lista_voluntarios, container, false);
        
        RecyclerView recyclerView = view.findViewById(R.id.rvVoluntarios);
        progressBar = view.findViewById(R.id.progressBarVoluntarios);
        
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new VoluntariosAdapter();
        recyclerView.setAdapter(adapter);
        
        cargarVoluntarios();
        
        return view;
    }
    
    private void cargarVoluntarios() {
        progressBar.setVisibility(View.VISIBLE);
        
        ApiClient.getApiService(getContext()).getVoluntarios().enqueue(new Callback<List<Voluntario>>() {
            @Override
            public void onResponse(Call<List<Voluntario>> call, Response<List<Voluntario>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    List<Voluntario> allVolunteers = response.body();
                    adapter.setDatos(allVolunteers);
                } else {
                     Toast.makeText(getContext(), "Error: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Voluntario>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(getContext(), "Fallo conex: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    public void filtrarLista(String texto) {
        if (adapter != null) {
            adapter.filtrar(texto);
        }
    }
}
