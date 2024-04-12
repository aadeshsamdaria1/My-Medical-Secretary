import com.mmsbackend.api.controllers.FacilityController
import com.mmsbackend.api.validation.FacilityValidation
import com.mmsbackend.jpa.entity.FacilityEntity
import com.mmsbackend.jpa.repository.FacilityEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
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
    private lateinit var facilityEntity: FacilityEntity

    @BeforeEach
    fun setup() {
        facilityController = FacilityController(
                facilityEntityRepository = facilityEntityRepository,
                facilityValidation = facilityValidation
        )

        every { facilityEntityRepository.findById(facilityId) } returns Optional.of(facilityEntity)
        every { facilityEntityRepository.findById(missingFacilityId) } returns Optional.empty()
        every { facilityValidation.isValidFacility(any()) } returns true
        justRun { facilityEntityRepository.deleteById(facilityId) }
    }

    @Test
    fun `Get facility by id when facility exists`() {
        val foundFacility = facilityController.getFacility(facilityId)
        assertEquals(facilityEntity, foundFacility)
    }

    @Test
    fun `Get facility by id when facility does not exist`() {
        val foundFacility = facilityController.getFacility(missingFacilityId)
        assertNull(foundFacility)
    }

    @Test
    fun `Create facility successfully`() {
        every { facilityEntity.id } returns facilityId
        every { facilityEntityRepository.save(facilityEntity) } returns facilityEntity

        val response = facilityController.createFacility(facilityEntity)
        val expectedResponse = ResponseEntity.ok("Successfully added new facility with ID: $facilityId")

        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Create facility fails with exception`() {
        every { facilityValidation.isValidFacility(facilityEntity)} returns false

        val response = facilityController.createFacility(facilityEntity)
        val expectedResponse = ResponseEntity.badRequest().body("Could not create facility. Missing valid ID")

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
        every { facilityValidation.isValidFacility(facilityEntity) } returns false

        val response = facilityController.deleteFacility(facilityId)
        val expectedResponse = ResponseEntity.badRequest().body("Could not delete facility. Facility with " +
                "ID $facilityId not found or invalid.")

        assertEquals(expectedResponse, response)
    }
}
