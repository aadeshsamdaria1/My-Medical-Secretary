package com.mmsbackend.mapping

import com.mmsbackend.dto.user.ResourceDTO
import com.mmsbackend.jpa.entity.ResourceEntity
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*

@ExtendWith(MockKExtension::class)
class ResourceMapperTest {
    private lateinit var resourceMapper: ResourceMapper

    @BeforeEach
    fun setup() {
        resourceMapper = ResourceMapper()
    }

    private val text = UUID.randomUUID().toString()
    private val link = UUID.randomUUID().toString()
    private val patientIds = listOf(1, 2, 3);

    private val resourceDTO = ResourceDTO( text, link, patientIds)

    @Test
    fun `Map Resource DTO to User Entity`() {
        val resource = resourceMapper.mapResourceDTO(resourceDTO);
        Assertions.assertThat(resource.text).isEqualTo(text);
        Assertions.assertThat(resource.link).isEqualTo(link);
        Assertions.assertThat(resource.id).isNotNull();
    }
}