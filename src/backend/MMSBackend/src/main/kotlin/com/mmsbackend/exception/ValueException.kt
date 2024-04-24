package com.mmsbackend.exception

class ValueException(val id: String, columnName: String): Exception(
    "Value error in id $id on column $columnName"
) {

}