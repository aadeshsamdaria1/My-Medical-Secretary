package com.mmsbackend.mapping

import com.mmsbackend.dto.user.ResourceDTO
import com.mmsbackend.jpa.entity.ResourceEntity
import org.springframework.stereotype.Service

@Service
class ResourceMapper {
    fun mapResourceDTO(resourceDTO: ResourceDTO): ResourceEntity {
        return ResourceEntity(
            text  = resourceDTO.text,
            link = resourceDTO.link,
            id = 0 // Randomly generated
        )
    }
}
