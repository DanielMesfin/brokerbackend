import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialLinksDto } from './dto/create-social-links.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';

@Injectable()
export class SocialLinksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSocialLinksDto: CreateSocialLinksDto) {
    // Check if user profile exists
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        socialLinks: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    // Check if social links already exist for this user
    if (userProfile.socialLinks) {
      throw new ConflictException('Social links already exist for this user');
    }

    // Create social links
    const socialLinks = await this.prisma.socialLink.create({
      data: {
        ...createSocialLinksDto,
      },
    });

    // Connect the created social links to the user profile (FK lives on UserProfile)
    await this.prisma.userProfile.update({
      where: { id: userProfile.id },
      data: {
        socialLinks: {
          connect: { id: socialLinks.id },
        },
      },
    });

    // Return the social links with the related user profile
    const result = await this.prisma.socialLink.findUnique({
      where: { id: socialLinks.id },
      include: {
        userProfile: true,
      },
    });

    return result;
  }

  async findByUserId(userId: string) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        socialLinks: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    return userProfile.socialLinks;
  }

  async findOne(id: string) {
    const socialLinks = await this.prisma.socialLink.findUnique({
      where: { id },
      include: {
        userProfile: true,
      },
    });

    if (!socialLinks) {
      throw new NotFoundException('Social links not found');
    }

    return socialLinks;
  }

  async update(id: string, updateSocialLinksDto: UpdateSocialLinksDto) {
    const existingSocialLinks = await this.prisma.socialLink.findUnique({
      where: { id },
    });

    if (!existingSocialLinks) {
      throw new NotFoundException('Social links not found');
    }

    const updatedSocialLinks = await this.prisma.socialLink.update({
      where: { id },
      data: updateSocialLinksDto,
      include: {
        userProfile: true,
      },
    });

    return updatedSocialLinks;
  }

  async remove(id: string) {
    const existingSocialLinks = await this.prisma.socialLink.findUnique({
      where: { id },
    });

    if (!existingSocialLinks) {
      throw new NotFoundException('Social links not found');
    }

    await this.prisma.socialLink.delete({
      where: { id },
    });

    return { message: 'Social links deleted successfully' };
  }

  async findByUserIdAndUpdate(userId: string, updateSocialLinksDto: UpdateSocialLinksDto) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        socialLinks: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    if (!userProfile.socialLinks) {
      // Create new social links if they don't exist
      return this.create(userId, updateSocialLinksDto as CreateSocialLinksDto);
    }

    // Update existing social links
    return this.update(userProfile.socialLinks.id, updateSocialLinksDto);
  }
}
