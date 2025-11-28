const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (use with caution)
  // Clear existing data (use with caution)
  await prisma.agentRun.deleteMany();
  await prisma.message.deleteMany();
  await prisma.draftOrder.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.knowledgeDoc.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.businessMember.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.business.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);
  const now = new Date();

  // Create users with different roles
  const users = await Promise.all([
    prisma.user.create({ 
      data: { 
        email: 'admin@unitlab.et', 
        passwordHash: password, 
        firstName: 'Abebe',
        secondName: 'Admin',
        phone: '+251900000001',
        role: 'ADMIN',
        isActive: true,
        createdAt: now,
        updatedAt: now
      } 
    }),
    prisma.user.create({ 
      data: { 
        email: 'influencer@ethio.et', 
        passwordHash: password, 
        firstName: 'Lulit',
        secondName: 'Influencer',
        phone: '+251900000002',
        role: 'INFLUENCER',
        isActive: true,
        createdAt: now,
        updatedAt: now
      } 
    }),
    prisma.user.create({ 
      data: { 
        email: 'brand@ethiotech.et', 
        passwordHash: password, 
        firstName: 'Ethio',
        secondName: 'Tech',
        phone: '+251900000003',
        role: 'BRAND',
        isActive: true,
        createdAt: now,
        updatedAt: now
      } 
    }),
    prisma.user.create({ 
      data: { 
        email: 'user@habesha.et', 
        passwordHash: password, 
        firstName: 'Kebede',
        secondName: 'User',
        phone: '+251900000004',
        role: 'USER',
        isActive: true,
        createdAt: now,
        updatedAt: now
      } 
    })
  ]);

  // Create social links records for some users
  const slInfluencer = await prisma.socialLink.create({
    data: {
      instagramUrl: 'https://instagram.com/influencer_one',
      twitterUrl: 'https://twitter.com/influencer_one',
      tiktokUrl: 'https://tiktok.com/@influencer_one',
      websiteUrl: 'https://influencer.one'
    }
    
  });

  // Additional Ethiopian businesses and members
  const dashen = await prisma.business.create({
    data: {
      name: 'Dashen Bank',
      description: 'Leading Ethiopian bank',
      website: 'https://dashenbanksc.com',
      industry: 'Finance',
      size: '1000+',
      isVerified: true
    }
  });
  await prisma.businessMember.create({
    data: {
      userId: users[0].id, // admin as representative
      businessId: dashen.id,
      role: 'ADMIN'
    }
  });

  const ethioAir = await prisma.business.create({
    data: {
      name: 'Ethiopian Airlines',
      description: 'Africa’s largest airline',
      website: 'https://www.ethiopianairlines.com',
      industry: 'Aviation',
      size: '10000+',
      isVerified: true
    }
  });
  await prisma.businessMember.create({
    data: {
      userId: users[3].id, // regular user as MEMBER
      businessId: ethioAir.id,
      role: 'MEMBER'
    }
  });

  // Create sample knowledge documents for RAG
  const knowledgeDocs = [
    {
      title: 'Product Return Policy',
      source: 'internal',
      text: 'Customers can return products within 14 days of purchase. Items must be unused and in original packaging. Refunds will be processed within 5 business days.',
    },
    {
      title: 'Shipping Information',
      source: 'internal',
      text: 'Standard shipping within Addis Ababa takes 2-3 business days. For regions outside Addis, delivery may take 5-7 business days. Express shipping is available at an additional cost.',
    },
    {
      title: 'Payment Methods',
      source: 'internal',
      text: 'We accept cash on delivery, bank transfer, and mobile money (Telebirr, CBE Birr, and M-Pesa). For large orders, we require a 30% deposit.',
    },
    {
      title: 'Wholesale Inquiries',
      source: 'internal',
      text: 'For wholesale orders, please contact our sales team at sales@unitlab.et or call +251 900 000 000. Minimum order quantity for wholesale is 10 units.',
    },
  ];

  await Promise.all(knowledgeDocs.map(doc => 
    prisma.knowledgeDoc.create({
      data: {
        title: doc.title,
        source: doc.source,
        text: doc.text,
      },
    })
  ));

  // Create sample listings
  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        title: 'Ethiopian Coffee Beans - Yirgacheffe',
        description: 'Premium grade 1 Yirgacheffe coffee beans, washed process. Grown in the highlands of Sidama, Addis Ababa.',
        type: 'C2C',
        category: 'Food & Beverage',
        price: 1200,
        tags: JSON.stringify(['coffee', 'yirgacheffe', 'premium', 'ethiopian']),
        isNegotiable: true,
        quantity: 50,
        minOrder: 1,
        maxOrder: 10,
        status: 'APPROVED',
        userId: users[1].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: 'Handwoven Ethiopian Scarf',
        description: 'Authentic Ethiopian handwoven scarf made from pure cotton. Available in various colors. Made in Addis Ababa.',
        type: 'B2C',
        category: 'Fashion',
        price: 850,
        tags: JSON.stringify(['scarf', 'handmade', 'cotton', 'traditional']),
        isNegotiable: false,
        quantity: 20,
        minOrder: 1,
        status: 'APPROVED',
        businessId: ethioAir.id,
      },
    }),
  ]);

  // Create sample conversations and messages
  const conversation1 = await prisma.conversation.create({
    data: {
      listingId: listings[0].id,
      buyerUserId: users[3].id,  // Regular user as buyer
      sellerUserId: users[1].id, // Influencer as seller
      status: 'OPEN',
    },
  });

  const messages1 = [
    { conversationId: conversation1.id, senderType: 'USER', text: 'Hello, I\'m interested in your coffee beans. Is the price negotiable?', createdAt: new Date(Date.now() - 3600000) },
    { conversationId: conversation1.id, senderType: 'AGENT', text: 'Thank you for your interest in our Yirgacheffe coffee beans. The price is slightly negotiable for bulk orders. How many kilos are you interested in?', createdAt: new Date(Date.now() - 3500000) },
    { conversationId: conversation1.id, senderType: 'USER', text: 'I was thinking about 5 kilos. What would be the price?', createdAt: new Date(Date.now() - 3400000) },
    { conversationId: conversation1.id, senderType: 'AGENT', text: 'For 5 kilos, I can offer you a 5% discount. That would be 5,700 ETB instead of 6,000 ETB. Would you like to proceed with this order?', createdAt: new Date(Date.now() - 3300000) },
  ];

  await Promise.all(messages1.map(msg => 
    prisma.message.create({ data: msg })
  ));

  // Create a draft order for the conversation
  await prisma.draftOrder.create({
    data: {
      conversationId: conversation1.id,
      listingId: listings[0].id,
      buyerUserId: users[3].id,
      sellerUserId: users[1].id,
      quantity: 5,
      priceAgreed: 5700,
      status: 'DRAFT',
      shippingInfo: JSON.stringify({
        address: 'Bole Road, Addis Ababa',
        contact: '+251900000004',
        name: 'Kebede User'
      })
    }
  });

  // Create another conversation
  const conversation2 = await prisma.conversation.create({
    data: {
      listingId: listings[1].id,
      buyerUserId: users[0].id,  // Admin as buyer
      sellerUserId: users[2].id,  // Brand as seller
      status: 'PENDING_ORDER',
    },
  });

  const messages2 = [
    { conversationId: conversation2.id, senderType: 'USER', text: 'Hi, do you have this scarf in black?', createdAt: new Date(Date.now() - 7200000) },
    { conversationId: conversation2.id, senderType: 'AGENT', text: 'Hello! Yes, we have the scarf in black. How many would you like?', createdAt: new Date(Date.now() - 7100000) },
    { conversationId: conversation2.id, senderType: 'USER', text: 'I would like 2 pieces. Do you offer delivery?', createdAt: new Date(Date.now() - 7000000) },
    { conversationId: conversation2.id, senderType: 'AGENT', text: 'Yes, we offer delivery within Addis Ababa for 100 ETB. Your total would be 1,800 ETB (2 x 850 + 100 delivery). Would you like to proceed?', createdAt: new Date(Date.now() - 6900000) },
  ];

  await Promise.all(messages2.map(msg => 
    prisma.message.create({ data: msg })
  ));

  // Additional Ethiopian customers
  const customers = [
    { companyName: 'Bunna Insurance', contactPerson: 'Tsedey Alemu', email: 'tsedey@bunnainsurance.et', phone: '+251911000111', billingAddress: 'Bole, Addis Ababa', shippingAddress: 'Bole, Addis Ababa' },
    { companyName: 'Nyala Motors', contactPerson: 'Haile Fekadu', email: 'haile@nyala.et', phone: '+251911000112', billingAddress: 'Kazanchis, Addis Ababa', shippingAddress: 'Kazanchis, Addis Ababa' },
    { companyName: 'Ethio Telecom', contactPerson: 'Saba Hailu', email: 'saba@ethiotelecom.et', phone: '+251911000113', billingAddress: 'Churchill Rd, Addis Ababa', shippingAddress: 'Churchill Rd, Addis Ababa' },
    { companyName: 'Hibret Bank', contactPerson: 'Biniam Bekele', email: 'biniam@hibretbank.com.et', phone: '+251911000114', billingAddress: 'Piazza, Addis Ababa', shippingAddress: 'Piazza, Addis Ababa' },
    { companyName: 'Amole Fintech', contactPerson: 'Rediet Girma', email: 'rediet@amole.et', phone: '+251911000115', billingAddress: 'CMC, Addis Ababa', shippingAddress: 'CMC, Addis Ababa' },
    { companyName: 'Zemen Bank', contactPerson: 'Yonatan Melesse', email: 'yonatan@zemenbank.com.et', phone: '+251911000116', billingAddress: 'Kazanchis, Addis Ababa', shippingAddress: 'Kazanchis, Addis Ababa' },
    { companyName: 'Berhan Insurance', contactPerson: 'Sarah Taye', email: 'sarah@berhaninsurance.et', phone: '+251911000117', billingAddress: 'Sarbet, Addis Ababa', shippingAddress: 'Sarbet, Addis Ababa' },
    { companyName: 'Sunset Hotel', contactPerson: 'Nahom Kassahun', email: 'nahom@sunsethotel.et', phone: '+251911000118', billingAddress: 'Bahir Dar, Ethiopia', shippingAddress: 'Bahir Dar, Ethiopia' },
    { companyName: 'Lucy Leather', contactPerson: 'Rahel Mamo', email: 'rahel@lucyleather.et', phone: '+251911000119', billingAddress: 'Merkato, Addis Ababa', shippingAddress: 'Merkato, Addis Ababa' }
  ];
  await Promise.all(customers.map(c => prisma.customer.create({ data: c })));

  // Additional posts across users
  const extraPostsPayload = [
    { author: users[1], content: 'Selam! New vlog about tech in Addis is live. #EthioTech', media: [] },
    { author: users[1], content: 'Coffee break at Tomoca ☕ #AddisLife', media: [] },
    { author: users[2], content: 'Launching our new ICT training in Bole!', media: [] },
    { author: users[3], content: 'Anyone going to ICT Expo Ethiopia?', media: [] },
    { author: users[2], content: 'Proud to support startups in Ethiopia 🇪🇹', media: [] },
    { author: users[3], content: 'Just tried injera with kitfo. Betam konjo!', media: [] }
  ];
  const extraPosts = await Promise.all(extraPostsPayload.map(p => prisma.post.create({
    data: {
      content: p.content,
      authorId: p.author.id,
      media: JSON.stringify(p.media),
      isPublished: true,
      isDeleted: false,
      createdAt: new Date()
    }
  })));

  // Enrich interactions (likes/follows) on extra posts
  await Promise.all([
    prisma.like.create({ data: { postId: extraPosts[0].id, userId: users[0].id } }),
    prisma.like.create({ data: { postId: extraPosts[1].id, userId: users[2].id } }),
    prisma.like.create({ data: { postId: extraPosts[2].id, userId: users[1].id } }),
    prisma.follow.create({ data: { followerId: users[2].id, followingId: users[0].id } }),
    prisma.follow.create({ data: { followerId: users[3].id, followingId: users[2].id } })
  ]);
  const slBrand = await prisma.socialLink.create({
    data: {
      linkedinUrl: 'https://linkedin.com/company/brand-company',
      twitterUrl: 'https://twitter.com/brand_company',
      facebookUrl: 'https://facebook.com/brand.company.official',
      websiteUrl: 'https://brand.company'
    }
  });

  // Create user profiles
  await Promise.all([
    prisma.userProfile.create({ 
      data: { 
        userId: users[1].id, 
        bio: 'Digital creator in Addis Ababa',
        website: 'https://influencer.et',
        location: 'Addis Ababa, Ethiopia',
        isVerified: true,
        socialLinksId: slInfluencer.id
      } 
    }),
    prisma.userProfile.create({ 
      data: { 
        userId: users[2].id, 
        bio: 'Ethiopian technology brand',
        website: 'https://ethiotech.et',
        location: 'Addis Ababa, Ethiopia',
        isVerified: true,
        socialLinksId: slBrand.id
      } 
    })
  ]);

  // Create posts with media
  const posts = await Promise.all([
    prisma.post.create({ 
      data: { 
        content: 'Selam Ethiopia! Excited to share my latest project from Addis. #coding #webdev',
        authorId: users[1].id,
        media: JSON.stringify([
          { type: 'image', url: 'https://example.com/media/1.jpg', alt: 'Project screenshot' }
        ]),
        isPublished: true,
        isDeleted: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    }),
    prisma.post.create({ 
      data: { 
        content: 'We\'re hiring in Addis Ababa! Check out our open positions.',
        authorId: users[2].id,
        media: JSON.stringify([]),
        isPublished: true,
        isDeleted: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    })
  ]);

  // Create comments
  const firstComment = await prisma.comment.create({ 
    data: { 
      content: 'Betam teru! This looks amazing! Great work!',
      postId: posts[0].id,
      authorId: users[2].id,
      isDeleted: false,
      createdAt: new Date()
    }
  });
  await prisma.comment.create({ 
    data: { 
      content: 'Amesegenallo! We\'re really proud of what we\'ve built.',
      postId: posts[0].id,
      authorId: users[1].id,
      parentId: firstComment.id, // Reply to first comment
      isDeleted: false,
      createdAt: new Date()
    }
  });

  // Create likes
  await Promise.all([
    prisma.like.create({ 
      data: { 
        postId: posts[0].id, 
        userId: users[2].id,
        createdAt: new Date()
      } 
    }),
    prisma.like.create({ 
      data: { 
        postId: posts[1].id, 
        userId: users[1].id,
        createdAt: new Date()
      } 
    })
  ]);

  // Create follows
  await Promise.all([
    prisma.follow.create({ 
      data: { 
        followerId: users[0].id, 
        followingId: users[1].id,
        createdAt: new Date()
      } 
    }),
    prisma.follow.create({ 
      data: { 
        followerId: users[1].id, 
        followingId: users[2].id,
        createdAt: new Date()
      } 
    }),
    prisma.follow.create({ 
      data: { 
        followerId: users[3].id, 
        followingId: users[1].id,
        createdAt: new Date()
      } 
    })
  ]);

  // Create a Business and add a member
  const business = await prisma.business.create({
    data: {
      name: 'EthioTech',
      description: 'Ethiopian leader in tech innovation',
      website: 'https://ethiotech.et',
      industry: 'Technology',
      size: '11-50',
      isVerified: true
    }
  });
  await prisma.businessMember.create({
    data: {
      userId: users[2].id, // brand user
      businessId: business.id,
      role: 'ADMIN'
    }
  });

  // Create a sample Customer
  await prisma.customer.create({
    data: {
      companyName: 'Hadero Coffee',
      contactPerson: 'Meron Tesfaye',
      email: 'meron.tesfaye@hadero.et',
      phone: '+251911234567',
      billingAddress: 'Bole, Addis Ababa',
      shippingAddress: 'Bole, Addis Ababa'
    }
  });

  // Create a sample Connection (friend request)
  await prisma.connection.create({
    data: {
      senderId: users[3].id, // regular user
      receiverId: users[1].id, // influencer
      status: 'APPROVED',
      connectedAt: new Date()
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('👥 Users created:', users.length);
  console.log('📝 Posts created:', posts.length);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
