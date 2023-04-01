<template>
    <div class="modal-container">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">{{ selectedMovie.title }}</h3>
                <button class="modal-close-btn" @click="closeModal">&times;</button>
            </div>
            <div class="modal-body">
                <img :src="getImageUrl(selectedMovie)" alt="Movie poster">
                <p class="modal-overview">{{ selectedMovie.overview }}</p>
                <div class="modal-info">
                    <p>Lançamento: {{ formatDate(selectedMovie.release_date) }}</p>
                    <p class="modal-rating">Nota: {{ selectedMovie.vote_average }}</p>
                </div>
                <button class="modal-close-btn" @click="closeModal">Fechar</button>
            </div>
        </div>
    </div>
</template>

<script>
import placeholder from "@/assets/placeholder.jpeg";

export default {
    name: 'MovieModal',
    props: {
        selectedMovie: {
            type: Object,
            required: true,
        },
    },
    methods: {
        getImageUrl(movie) {
            if (movie.poster_path) {
                return `https://image.tmdb.org/t/p/w185/${movie.poster_path}`;
            }
            return placeholder;
        },
        closeModal() {
            this.$emit('close-modal');
        },
        formatDate(date) {
            const [year, month, day] = date.split('-');
            const formattedDate = new Date(year, month - 1, day);
            return formattedDate.toLocaleDateString('pt-BR');
        }
    },
};
</script>

<style>
/* Modal */
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    width: 90%;
    max-width: 600px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
}

.modal-close-btn {
    background-color: transparent;
    border: none;
    font-size: 28px;
    color: #333;
    cursor: pointer;
}

.modal-close-btn:hover {
    color: #666;
}

.modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-body img {
    width: 200px;
    margin-bottom: 20px;
}

.modal-overview {
    font-size: 18px;
    line-height: 1.5;
    text-align: justify;
    margin-bottom: 20px;
}

.modal-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-info p {
    margin: 0;
}

.modal-rating {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
}

.modal-close-btn {
    background-color: #3f51b5;
    border: none;
    color: #fff;
    font-size: 18px;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 20px;
    cursor: pointer;
}

.modal-close-btn:hover {
    background-color: #303f9f;
}
</style>
