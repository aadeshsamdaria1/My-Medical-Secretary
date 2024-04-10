package com.mmsbackend.util

fun mapAddress(address1: String, address2: String): String {
    return when {
        address1.isBlank() && address2.isBlank() -> ""
        address1.isBlank() -> address2
        address2.isBlank() -> address1
        else -> "$address1, $address2"
    }
}
