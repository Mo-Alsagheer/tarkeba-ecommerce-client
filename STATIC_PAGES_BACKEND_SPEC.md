# Static Pages Management - Backend Implementation Guide

## Overview
This document outlines the requirements for implementing a static pages management system in NestJS. This feature allows administrators to create and manage static content pages like "About Us", "Privacy Policy", "Terms of Service", etc.

## Database Schema

### Pages Collection (MongoDB)
```typescript
{
  _id: ObjectId,
  slug: String, // unique, indexed, e.g., "about-us", "privacy-policy"
  title: String, // Page title, e.g., "About Us"
  content: String, // HTML content
  metaDescription?: String, // Optional SEO meta description (max 160 chars)
  isPublished: Boolean, // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `slug`: unique index for fast lookups
- `isPublished`: for filtering published pages
- `createdAt`: for sorting

## API Endpoints

### 1. Get All Pages
```
GET /api/pages
```

**Query Parameters:**
- None (returns all pages for admin)

**Response:**
```typescript
{
  pages: [
    {
      _id: "507f1f77bcf86cd799439011",
      slug: "about-us",
      title: "About Us",
      content: "<h1>About Our Company</h1><p>We are...</p>",
      metaDescription: "Learn more about our company and mission",
      isPublished: true,
      createdAt: "2026-01-30T10:00:00.000Z",
      updatedAt: "2026-01-30T10:00:00.000Z"
    }
  ],
  total: 1
}
```

**Access:** Admin only

---

### 2. Get Page by Slug
```
GET /api/pages/:slug
```

**Parameters:**
- `slug`: string (e.g., "about-us")

**Response:**
```typescript
{
  _id: "507f1f77bcf86cd799439011",
  slug: "about-us",
  title: "About Us",
  content: "<h1>About Our Company</h1><p>We are...</p>",
  metaDescription: "Learn more about our company and mission",
  isPublished: true,
  createdAt: "2026-01-30T10:00:00.000Z",
  updatedAt: "2026-01-30T10:00:00.000Z"
}
```

**Access:** Public (but only returns published pages for non-admin users)

**Error Responses:**
- `404`: Page not found
- `403`: Page is not published (for non-admin users)

---

### 3. Create Page
```
POST /api/pages
```

**Request Body:**
```typescript
{
  slug: string, // required, must be unique, lowercase with hyphens
  title: string, // required, min 3 chars
  content: string, // required, min 10 chars
  metaDescription?: string, // optional, max 160 chars
  isPublished?: boolean // optional, default true
}
```

**Validation Rules:**
- `slug`: 
  - Required
  - Must be unique
  - Only lowercase letters, numbers, and hyphens
  - Pattern: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- `title`: Required, min 3 characters, max 200 characters
- `content`: Required, min 10 characters
- `metaDescription`: Optional, max 160 characters
- `isPublished`: Optional boolean, default true

**Response:**
```typescript
{
  page: {
    _id: "507f1f77bcf86cd799439011",
    slug: "about-us",
    title: "About Us",
    content: "<h1>About Our Company</h1>",
    metaDescription: "Learn more about us",
    isPublished: true,
    createdAt: "2026-01-30T10:00:00.000Z",
    updatedAt: "2026-01-30T10:00:00.000Z"
  }
}
```

**Access:** Admin only

**Error Responses:**
- `400`: Validation error or duplicate slug
- `401`: Unauthorized
- `403`: Forbidden (not admin)

---

### 4. Update Page
```
PATCH /api/pages/:id
```

**Parameters:**
- `id`: MongoDB ObjectId

**Request Body (all fields optional):**
```typescript
{
  title?: string,
  content?: string,
  metaDescription?: string,
  isPublished?: boolean
}
```

**Note:** `slug` cannot be updated after creation

**Validation Rules:**
- `title`: Optional, min 3 characters if provided
- `content`: Optional, min 10 characters if provided
- `metaDescription`: Optional, max 160 characters if provided
- `isPublished`: Optional boolean

**Response:**
```typescript
{
  page: {
    _id: "507f1f77bcf86cd799439011",
    slug: "about-us",
    title: "Updated Title",
    content: "<h1>Updated Content</h1>",
    metaDescription: "Updated description",
    isPublished: true,
    createdAt: "2026-01-30T10:00:00.000Z",
    updatedAt: "2026-01-30T12:00:00.000Z"
  }
}
```

**Access:** Admin only

**Error Responses:**
- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Page not found

---

### 5. Delete Page
```
DELETE /api/pages/:id
```

**Parameters:**
- `id`: MongoDB ObjectId

**Response:**
```typescript
{
  message: "Page deleted successfully"
}
```

**Access:** Admin only

**Error Responses:**
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Page not found

---

## DTOs

### CreatePageDto
```typescript
import { 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  IsBoolean, 
  IsOptional,
  Matches 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({
    description: 'Unique slug for the page URL',
    example: 'about-us',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens only',
  })
  slug: string;

  @ApiProperty({
    description: 'Page title',
    example: 'About Us',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'HTML content of the page',
    example: '<h1>About Us</h1><p>We are...</p>',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: 'Meta description for SEO',
    example: 'Learn more about our company',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  metaDescription?: string;

  @ApiProperty({
    description: 'Whether the page is published',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
```

### UpdatePageDto
```typescript
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';

// Exclude slug from updates
export class UpdatePageDto extends PartialType(
  OmitType(CreatePageDto, ['slug'] as const)
) {}
```

---

## Schema Definition (Mongoose)

```typescript
// page.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Page extends Document {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ maxlength: 160 })
  metaDescription?: string;

  @Prop({ default: true, index: true })
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);

// Add text index for search if needed
PageSchema.index({ title: 'text', content: 'text' });
```

---

## Service Methods

### PagesService
```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from './schemas/page.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<Page>,
  ) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    try {
      const page = new this.pageModel(createPageDto);
      return await page.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Page with this slug already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<{ pages: Page[]; total: number }> {
    const pages = await this.pageModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      pages,
      total: pages.length,
    };
  }

  async findBySlug(slug: string, isAdmin = false): Promise<Page> {
    const query: any = { slug };
    
    // Non-admin users can only see published pages
    if (!isAdmin) {
      query.isPublished = true;
    }
    
    const page = await this.pageModel.findOne(query).exec();
    
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    
    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.pageModel
      .findByIdAndUpdate(id, updatePageDto, { new: true })
      .exec();
    
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    
    return page;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pageModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('Page not found');
    }
  }
}
```

---

## Controller Implementation

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new page (Admin only)' })
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pages (Admin only)' })
  findAll() {
    return this.pagesService.findAll();
  }

  @Get(':slug')
  @Public() // Public endpoint
  @ApiOperation({ summary: 'Get page by slug' })
  findOne(@Param('slug') slug: string, @Request() req) {
    // Check if user is admin
    const isAdmin = req.user?.roles?.includes('admin') || false;
    return this.pagesService.findBySlug(slug, isAdmin);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a page (Admin only)' })
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a page (Admin only)' })
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
```

---

## Module Registration

```typescript
// pages.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { Page, PageSchema } from './schemas/page.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
```

Don't forget to import `PagesModule` in your `AppModule`:

```typescript
// app.module.ts
@Module({
  imports: [
    // ... other imports
    PagesModule,
  ],
})
export class AppModule {}
```

---

## Testing Endpoints

### Create a Page
```bash
curl -X POST http://localhost:5000/api/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "slug": "about-us",
    "title": "About Us",
    "content": "<h1>About Our Company</h1><p>We are a leading e-commerce platform...</p>",
    "metaDescription": "Learn more about our company and mission",
    "isPublished": true
  }'
```

### Get All Pages
```bash
curl -X GET http://localhost:5000/api/pages \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Page by Slug (Public)
```bash
curl -X GET http://localhost:5000/api/pages/about-us
```

### Update Page
```bash
curl -X PATCH http://localhost:5000/api/pages/PAGE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Updated About Us",
    "isPublished": false
  }'
```

### Delete Page
```bash
curl -X DELETE http://localhost:5000/api/pages/PAGE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Security Considerations

1. **Admin-Only Access**: All create/update/delete operations require admin role
2. **Published Status**: Non-admin users can only view published pages
3. **HTML Sanitization**: Consider sanitizing HTML content on the backend to prevent XSS attacks:
   ```typescript
   import * as sanitizeHtml from 'sanitize-html';
   
   // In service create/update methods
   const sanitizedContent = sanitizeHtml(createPageDto.content, {
     allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
     allowedAttributes: {
       ...sanitizeHtml.defaults.allowedAttributes,
       '*': ['class', 'id', 'style']
     }
   });
   ```
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse
5. **Slug Validation**: Ensure slugs don't conflict with existing routes

---

## Optional Enhancements

1. **Versioning**: Keep history of page changes
2. **Draft/Preview**: Allow preview before publishing
3. **Search**: Implement full-text search on pages
4. **Localization**: Support multiple languages
5. **Media Management**: Add image upload for page content
6. **SEO Fields**: Add more SEO fields (keywords, og:tags, etc.)
7. **Scheduling**: Schedule publish/unpublish dates

---

## Error Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error, duplicate slug) |
| 401 | Unauthorized |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Database Indexes

```typescript
// Recommended indexes for performance
db.pages.createIndex({ slug: 1 }, { unique: true });
db.pages.createIndex({ isPublished: 1 });
db.pages.createIndex({ createdAt: -1 });
db.pages.createIndex({ title: "text", content: "text" }); // For search
```

---

## Notes

- All timestamps are in ISO 8601 format
- MongoDB ObjectIds are 24-character hex strings
- HTML content should be properly escaped on the frontend when rendering
- Consider implementing caching (Redis) for frequently accessed pages
- Add logging for audit trail (who created/updated pages)
