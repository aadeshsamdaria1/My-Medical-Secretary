package com.mmsbackend.util

fun mapAddress(address1: String?, address2: String?): String? {
    return when {
        address1.isNullOrBlank() && address2.isNullOrBlank() -> null
        address1.isNullOrBlank() -> address2
        address2.isNullOrBlank() -> address1
        else -> "$address1, $address2"
    }
}
