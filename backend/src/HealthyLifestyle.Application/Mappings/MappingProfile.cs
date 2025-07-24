using AutoMapper;
using HealthyLifestyle.Application.DTOs.Auth;
using HealthyLifestyle.Application.DTOs.ProfessionalQualification;
using HealthyLifestyle.Application.DTOs.User;
using HealthyLifestyle.Core.Entities;
using HealthyLifestyle.Core.Enums;

namespace HealthyLifestyle.Application.Mappings
{
    /// <summary>
    /// Профіль мапінгу для конфігурації AutoMapper, що визначає відображення між DTO та сутностями.
    /// Використовується для автоматизації перетворення даних у додатку.
    /// </summary>
    public class MappingProfile : Profile
    {
        #region Конструктор

        /// <summary>
        /// Ініціалізує новий екземпляр <see cref="MappingProfile"/> і конфігурує мапінги.
        /// </summary>
        public MappingProfile()
        {
            ConfigureAuthAndUserMappings();
            ConfigureProfessionalQualificationMappings();
            ConfigureTrainerDetailsMappings();
            ConfigureDietitianDetailsMappings();
            ConfigureDoctorDetailsMappings();
            ConfigurePsychologistDetailsMappings();
        }
        #endregion

        #region Приватні методи конфігурації мапінгів

        /// <summary>
        /// Конфігурує мапінги для авторизації та користувачів.
        /// </summary>
        private void ConfigureAuthAndUserMappings()
        {
            CreateMap<RegisterUserDto, User>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.SecurityStamp, opt => opt.Ignore())
                .ForMember(dest => dest.ConcurrencyStamp, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<User, AuthResponseDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id.ToString()));

            CreateMap<User, UserDto>();

            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.FullName, opt => opt.Condition(src => src.FullName != null))
                .ForMember(dest => dest.DateOfBirth, opt => opt.Condition(src => src.DateOfBirth.HasValue))
                .ForMember(dest => dest.Gender, opt => opt.Condition(src => src.Gender.HasValue))
                .ForMember(dest => dest.Weight, opt => opt.Condition(src => src.Weight.HasValue))
                .ForMember(dest => dest.Height, opt => opt.Condition(src => src.Height.HasValue))
                .ForMember(dest => dest.ProfilePictureUrl, opt => opt.Condition(src => src.ProfilePictureUrl != null))
                .ForMember(dest => dest.Bio, opt => opt.Condition(src => src.Bio != null))
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.UserName, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }

        /// <summary>
        /// Конфігурує мапінги для професійних кваліфікацій.
        /// </summary>
        private void ConfigureProfessionalQualificationMappings()
        {
            CreateMap<ProfessionalRoleType, ProfessionalRoleTypeDto>();

            CreateMap<CreateProfessionalQualificationDto, UserProfessionalQualification>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => QualificationStatus.Pending))
                .ForMember(dest => dest.ApprovalDate, opt => opt.Ignore())
                .ForMember(dest => dest.ProfessionalRoleType, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.HourlyRate, opt => opt.MapFrom(src => src.HourlyRate ?? 0m))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<UserProfessionalQualification, UserProfessionalQualificationDto>()
                .ForMember(dest => dest.QualificationStatus, opt => opt.MapFrom(src => src.Status.ToString()));
        }

        /// <summary>
        /// Конфігурує мапінги для деталей тренера.
        /// </summary>
        private void ConfigureTrainerDetailsMappings()
        {
            CreateMap<TrainerDetailsDto, TrainerDetails>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QualificationId))
                .ForMember(dest => dest.UserProfessionalQualification, opt => opt.Ignore())
                .ForMember(dest => dest.TrainingStyle, opt => opt.MapFrom(src => src.TrainingStyle))
                .ForMember(dest => dest.Biography, opt => opt.Condition(src => src.Biography != null))
                .ForMember(dest => dest.YearsOfExperience, opt => opt.Condition(src => src.YearsOfExperience.HasValue))
                .ForMember(dest => dest.Certifications, opt => opt.Condition(src => src.Certifications != null))
                .ForMember(dest => dest.Availability, opt => opt.Condition(src => src.Availability != null))
                .ForMember(dest => dest.PreferredWorkoutStyles, opt => opt.Condition(src => src.PreferredWorkoutStyles != null))
                .ForMember(dest => dest.ProfessionalLicenseNumber, opt => opt.Condition(src => src.ProfessionalLicenseNumber != null))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<TrainerDetails, TrainerDetailsDto>()
                .ForMember(dest => dest.TrainingStyle, opt => opt.MapFrom(src => src.TrainingStyle))
                .ForMember(dest => dest.QualificationId, opt => opt.MapFrom(src => src.Id));
        }

        /// <summary>
        /// Конфігурує мапінги для деталей дієтолога.
        /// </summary>
        private void ConfigureDietitianDetailsMappings()
        {
            CreateMap<DietitianDetailsDto, DietitianDetails>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QualificationId))
                .ForMember(dest => dest.UserProfessionalQualification, opt => opt.Ignore())
                .ForMember(dest => dest.Specializations, opt => opt.Condition(src => src.Specializations != null))
                .ForMember(dest => dest.Biography, opt => opt.Condition(src => src.Biography != null))
                .ForMember(dest => dest.YearsOfExperience, opt => opt.Condition(src => src.YearsOfExperience.HasValue))
                .ForMember(dest => dest.Certifications, opt => opt.Condition(src => src.Certifications != null))
                .ForMember(dest => dest.NutritionalApproach, opt => opt.Condition(src => src.NutritionalApproach != null))
                .ForMember(dest => dest.ProfessionalLicenseNumber, opt => opt.Condition(src => src.ProfessionalLicenseNumber != null))
                .ForMember(dest => dest.Availability, opt => opt.Condition(src => src.Availability != null))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<DietitianDetails, DietitianDetailsDto>()
                .ForMember(dest => dest.QualificationId, opt => opt.MapFrom(src => src.Id));
        }

        /// <summary>
        /// Конфігурує мапінги для деталей лікаря.
        /// </summary>
        private void ConfigureDoctorDetailsMappings()
        {
            CreateMap<DoctorDetailsDto, DoctorDetails>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QualificationId))
                .ForMember(dest => dest.UserProfessionalQualification, opt => opt.Ignore())
                .ForMember(dest => dest.Specializations, opt => opt.Condition(src => src.Specializations != null))
                .ForMember(dest => dest.Biography, opt => opt.Condition(src => src.Biography != null))
                .ForMember(dest => dest.YearsOfExperience, opt => opt.Condition(src => src.YearsOfExperience.HasValue))
                .ForMember(dest => dest.Certifications, opt => opt.Condition(src => src.Certifications != null))
                .ForMember(dest => dest.ClinicAffiliation, opt => opt.Condition(src => src.ClinicAffiliation != null))
                .ForMember(dest => dest.ProfessionalLicenseNumber, opt => opt.Condition(src => src.ProfessionalLicenseNumber != null))
                .ForMember(dest => dest.Availability, opt => opt.Condition(src => src.Availability != null))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<DoctorDetails, DoctorDetailsDto>()
                .ForMember(dest => dest.QualificationId, opt => opt.MapFrom(src => src.Id));
        }

        /// <summary>
        /// Конфігурує мапінги для деталей психолога.
        /// </summary>
        private void ConfigurePsychologistDetailsMappings()
        {
            CreateMap<PsychologistDetailsDto, PsychologistDetails>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QualificationId))
                .ForMember(dest => dest.UserProfessionalQualification, opt => opt.Ignore())
                .ForMember(dest => dest.TherapyApproaches, opt => opt.Condition(src => src.TherapyApproaches != null))
                .ForMember(dest => dest.ProfessionalLicenseNumber, opt => opt.Condition(src => src.ProfessionalLicenseNumber != null))
                .ForMember(dest => dest.Biography, opt => opt.Condition(src => src.Biography != null))
                .ForMember(dest => dest.ContactEmail, opt => opt.Condition(src => src.ContactEmail != null))
                .ForMember(dest => dest.ContactPhone, opt => opt.Condition(src => src.ContactPhone != null))
                .ForMember(dest => dest.Website, opt => opt.Condition(src => src.Website != null))
                .ForMember(dest => dest.YearsOfExperience, opt => opt.Condition(src => src.YearsOfExperience.HasValue))
                .ForMember(dest => dest.Certifications, opt => opt.Condition(src => src.Certifications != null))
                .ForMember(dest => dest.Availability, opt => opt.Condition(src => src.Availability != null))
                .ForMember(dest => dest.ClientTestimonials, opt => opt.Condition(src => src.ClientTestimonials != null))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<PsychologistDetails, PsychologistDetailsDto>()
                .ForMember(dest => dest.QualificationId, opt => opt.MapFrom(src => src.Id));
        }
        #endregion
    }
}