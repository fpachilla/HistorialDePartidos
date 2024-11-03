<template>
    <nav>
        <ul>
            <li>
                <router-link :to="{ name: 'Equipos' }">
                    Equipos
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'Historial' }">
                    Historial
                </router-link>
            </li>
        </ul>
    </nav>
</template>