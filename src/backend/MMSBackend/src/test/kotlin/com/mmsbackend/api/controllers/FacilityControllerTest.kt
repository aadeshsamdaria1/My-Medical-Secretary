import com.mmsbackend.api.controllers.FacilityController
import com.mmsbackend.api.validation.FacilityValidation
import com.mmsbackend.dto.user.FacilityDTO
import com.mmsbackend.enums.FacilityType
import com.mmsbackend.jpa.entity.FacilityEntity
import com.mmsbackend.jpa.repository.FacilityEntityRepository
import com.mmsbackend.mapping.FacilityMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.ResponseEntity
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class FacilityControllerTest {

    private lateinit var facilityController: FacilityController
    private val facilityId = Random.nextInt()
    private val missingFacilityId = facilityId + 1

    @MockK
    private lateinit var facilityValidation: FacilityValidation

    @MockK
    private lateinit var facilityEntityRepository: FacilityEntityRepository

    @MockK
    private lateinit var facilityDTO: FacilityDTO

    @MockK
    private lateinit var facilityEntity1: FacilityEntity

    @MockK
    private lateinit var facilityEntity2: FacilityEntity

    @MockK
    private lateinit var facilityMapper: FacilityMapper

    @BeforeEach
    fun setup() {
        facilityController = FacilityController(
            facilityEntityRepository = facilityEntityRepository,
            facilityValidation = facilityValidation,
            facilityMapper = facilityMapper
        )

        every { facilityEntityRepository.findById(facilityId) } returns Optional.of(facilityEntity1)
        every { facilityEntityRepository.findById(missingFacilityId) } returns Optional.empty()
        every { facilityValidation.isValidFacility( facilityEntity1 ) } returns true
        every { facilityMapper.mapFacilityDTO(facilityDTO) } returns facilityEntity1
        every { facilityEntityRepository.findAll() } returns listOf(facilityEntity2, facilityEntity1)
        every { facilityEntity1.name } returns "Entity 1"
        every { facilityEntity2.name } returns "Entity 2"
        justRun { facilityEntityRepository.deleteById(facilityId) }
    }

    @Test
    fun `Get facility by id when facility exists`() {
        val foundFacility = facilityController.getFacility(facilityId)
        assertEquals(facilityEntity1, foundFacility)
    }

    @Test
    fun `Get facility by id when facility does not exist`() {
        val foundFacility = facilityController.getFacility(missingFacilityId)
        assertNull(foundFacility)
    }

    @Test
    fun `Get all facilities sorted by name`() {
        val facilities = facilityController.getAllFacilities()
        assertThat(facilities).isEqualTo(listOf(facilityEntity1, facilityEntity2))
    }

    @Test
    fun `Get all facilities by type`() {
        every { facilityEntity1.facilityType } returns FacilityType.PATHOLOGY
        every { facilityEntity2.facilityType } returns FacilityType.HOSPITAL

        val facilities = facilityController.getAllFacilitiesByType(FacilityType.HOSPITAL)
        assertThat(facilities).isEqualTo(listOf(facilityEntity2))
    }

    @Test
    fun `Create facility successfully`() {
        every { facilityEntity1.id } returns facilityId
        every { facilityEntityRepository.save(facilityEntity1) } returns facilityEntity1

        val response = facilityController.createFacility(facilityDTO)
        val expectedResponse = ResponseEntity.ok("Successfully added new facility with ID: $facilityId")

        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Delete facility successfully`() {
        val response = facilityController.deleteFacility(facilityId)
        val expectedResponse = ResponseEntity.ok("Facility with ID $facilityId deleted successfully.")

        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Delete facility fails when facility not found`() {
        every { facilityEntityRepository.findById(missingFacilityId) } returns Optional.empty()

        val response = facilityController.deleteFacility(missingFacilityId)
        val expectedResponse = ResponseEntity.badRequest().body("Could not delete facility. Facility with " +
                "ID $missingFacilityId not found or invalid.")

        assertEquals(expectedResponse, response)
    }

    // Facility is found, but fails the validation
    @Test
    fun `Delete facility fails when facility invalid`() {
        every { facilityValidation.isValidFacility(facilityEntity1) } returns false

        val response = facilityController.deleteFacility(facilityId)
        val expectedResponse = ResponseEntity.badRequest().body("Could not delete facility. Facility with " +
                "ID $facilityId not found or invalid.")

        assertEquals(expectedResponse, response)
    }
}
