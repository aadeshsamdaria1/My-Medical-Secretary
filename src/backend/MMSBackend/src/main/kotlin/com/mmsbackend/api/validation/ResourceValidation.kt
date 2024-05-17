package com.mmsbackend.api.validation

import com.mmsbackend.dto.user.ResourceDTO
import com.mmsbackend.jpa.entity.ResourceEntity
import org.springframework.stereotype.Service

@Service
class ResourceValidation {
    fun isValidResource(resource: ResourceDTO): Boolean {
        return (resource.link != null || resource.text != null)
    }
}
