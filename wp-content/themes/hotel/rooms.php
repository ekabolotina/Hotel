<?php
/**
 * Template Name: Номера
 * Description: Шаблон страницы с номерами.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'rooms.twig', 'home.twig' ), $context );
