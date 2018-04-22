<?php
/**
 * Template Name: Главная
 * Description: Шаблон главной страницы
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'home.twig', 'page.twig' ), $context );
