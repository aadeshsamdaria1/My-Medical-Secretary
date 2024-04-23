package com.mmsbackend.exception

class ColumnError(column: String) : Exception(
    "Column $column not found"
){
}