package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;


public class PasadasActividadesFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Reutilizamos el layout que ya tenías para la lista o creamos uno simple con solo el RecyclerView
        // Para simplificar, supongamos que tienes un layout 'fragment_lista.xml' con un RecyclerView dentro
        View view = inflater.inflate(R.layout.fragment_lista_actividades, container, false); // Crea este xml con solo el RecyclerView

        RecyclerView recyclerView = view.findViewById(R.id.rvActividades);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        ArrayList<Actividad> lista = new ArrayList<>();
        // TODO con el enpoint de cojer todas las actividades se le tiene que poner por parámetro para que filtre por actividades pasadas y próximas
        lista.add(new Actividad("Reforestación Monte Ezcaba", "Acción Verde", "12/03/2026", "Monte Ezcaba", "Jornada matutina para plantar árboles autóctonos y limpiar senderos en la zona norte.", 50));
        lista.add(new Actividad("Taller de Lectura Infantil", "Cruz Roja", "25/02/2026", "Civivox Iturrama", "Actividad lúdica para fomentar la lectura en niños de 6 a 10 años con merienda incluida.", 15));
        lista.add(new Actividad("Limpieza del Río Arga", "EcoNavarra", "04/04/2026", "Parque Fluvial", "Recogida de plásticos y residuos en la orilla del río. Se proporcionan guantes y bolsas.", 40));
        lista.add(new Actividad("Acompañamiento Mayor", "Amigos de la 3ª Edad", "10/01/2026", "Residencia Solera", "Visita y juegos de mesa con residentes mayores para combatir la soledad no deseada.", 10));
        lista.add(new Actividad("Torneo Benéfico Pádel", "Fundación Deporte", "15/05/2026", "Club Tenis", "Torneo amateur para recaudar fondos destinados a becas deportivas infantiles.", 32));
        lista.add(new Actividad("Recogida Juguetes", "Asoc. Vecinos", "20/12/2025", "Rochapea", "Campaña navideña para recolectar juguetes en buen estado para familias vulnerables.", 25));
        lista.add(new Actividad("Paseo Perruno", "Protectora Mutilva", "08/11/2025", "Mutilva", "Caminata solidaria con perros del refugio para fomentar su adopción y socialización.", 20));
        lista.add(new Actividad("Clases de Español", "Ayuda al Refugiado", "01/02/2026", "Casco Antiguo", "Voluntariado para practicar conversación básica con personas recién llegadas a la ciudad.", 12));
        lista.add(new Actividad("Mercadillo Solidario", "París 365", "14/06/2026", "Paseo Sarasate", "Venta de ropa de segunda mano y artesanías para financiar el comedor social.", 100));
        lista.add(new Actividad("Donación de Sangre", "Adona", "30/01/2026", "Plaza del Castillo", "Unidad móvil de extracción disponible todo el día. Se necesita urgentemente grupo 0-.", 200));
        lista.add(new Actividad("Taller Reciclaje", "Mancomunidad", "22/04/2026", "Mendillorri", "Taller creativo para aprender a reutilizar envases domésticos y crear objetos útiles.", 30));
        lista.add(new Actividad("Cinefórum Social", "Amnistía Internacional", "18/03/2026", "Golem Baiona", "Proyección de documental sobre derechos humanos seguido de un debate abierto.", 80));

        RecyclerDataAdapter adapter = new RecyclerDataAdapter(lista, new RecyclerDataAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Actividad actividad, int position) {
                Intent intent = new Intent(getContext(), DetalleActividadActivity.class);
                intent.putExtra("nombre", actividad.getNombre());
                startActivity(intent);
            }
        });
        recyclerView.setAdapter(adapter);

        return view;
    }
}