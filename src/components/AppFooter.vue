<template>
    <footer class="footer">
        <div class="container">
            <p>© {{ new Date().getFullYear() }} Desenvolvido por <a href="https://github.com/tuliocaique" target="_blank">@tuliocaique</a>. Todos os direitos reservados.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: "AppFooter"
}
</script>

<style scoped>
.footer {
    background-color: #f8f9fa;
    padding: 20px 0;
    text-align: center;
    margin-top: 50px;
    flex-shrink: 0;
    height: 50px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

p {
    font-size: 14px;
    color: #6c757d;
    margin: 0;
}
</style>
