<?php
/**
 * Template Name: Карта
 * Description: Шаблон страницы с картой.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'map.twig', 'home.twig' ), $context );
