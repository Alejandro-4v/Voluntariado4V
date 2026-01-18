package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class HomeFragment extends Fragment {

    public HomeFragment() {
        // Required empty public constructor
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // Configurar botón "Ver Actividades"
        View btnViewActivities = view.findViewById(R.id.btnViewActivities);
        btnViewActivities.setOnClickListener(v -> {
            if (getActivity() instanceof ActividadesActivity) {
                ((ActividadesActivity) getActivity()).viewPager.setCurrentItem(1, true);
            }
        });

        return view;
    }
}
