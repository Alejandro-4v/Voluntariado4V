package com.example.aplicacionmovilvoluntaridado;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
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

        // 1. Personalizar saludo
        TextView tvUserName = view.findViewById(R.id.tvUserName);
        if (getActivity() != null) {
            SharedPreferences prefs = requireActivity().getSharedPreferences("VoluntariadoPrefs", Context.MODE_PRIVATE);
            String userName = prefs.getString("user_name", "Voluntario");
            if (tvUserName != null) {
                tvUserName.setText(userName);
            }
        }

        // 2. Configurar botones de navegación
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

        return view;
    }
}
